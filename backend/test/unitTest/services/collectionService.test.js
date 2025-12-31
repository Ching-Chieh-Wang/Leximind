const collectionRepo = require('../../../src/repositories/collection');
const wordRepo = require('../../../src/repositories/word');
const cacheService = require('../../../src/services/cacheService');

const collectionService = require('../../../src/services/collectionService');

jest.mock('../../../src/repositories/collection', () => ({
  create: jest.fn(),
  getPublicById: jest.fn(),
  getPrivateById: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  getPaginatedByUserIdSortedByLastViewedAt: jest.fn(),
  searchPublicCollections: jest.fn(),
}));

jest.mock('../../../src/repositories/word', () => ({
  getWordStats: jest.fn(),
}));

jest.mock('../../../src/services/cacheService', () => ({
  getCache: jest.fn(),
  setCache: jest.fn(),
  removeCache: jest.fn(),
  getSetCache: jest.fn(),
  setSetCache: jest.fn(),
  setPfadd: jest.fn(),
  redis: {
    pipeline: jest.fn(),
  },
}));

describe('collectionService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates a collection and clears cache', async () => {
    collectionRepo.create.mockResolvedValue({ id: 1, created_at: '2024-01-01' });

    const result = await collectionService.create({
      user_id: 'user-1',
      name: 'Name',
      description: 'Desc',
      is_public: false,
    });

    expect(collectionRepo.create).toHaveBeenCalledWith('user-1', 'Name', 'Desc', false);
    expect(cacheService.removeCache).toHaveBeenCalledWith('userId:user-1:collections');
    expect(result).toEqual({ status: 201, data: { id: 1, created_at: '2024-01-01' } });
  });

  it('returns 404 when public collection not found from cache', async () => {
    cacheService.getCache.mockResolvedValue('NOT_FOUND');

    const result = await collectionService.getPublicById({
      user_id: 'user-1',
      collection_id: '10',
    });

    expect(result).toEqual({ status: 404, error: { message: 'Collection not found' } });
  });

  it('loads public collection from repo and caches it', async () => {
    cacheService.getCache.mockResolvedValue(null);
    collectionRepo.getPublicById.mockResolvedValue({ userId: 'owner-1', name: 'Public' });

    const result = await collectionService.getPublicById({
      user_id: 'viewer-1',
      collection_id: '10',
    });

    expect(collectionRepo.getPublicById).toHaveBeenCalledWith('10');
    expect(cacheService.setCache).toHaveBeenCalled();
    expect(cacheService.setPfadd).toHaveBeenCalledWith('collection:view:10', 'viewer-1');
    expect(result.status).toBe(200);
  });

  it('hydrates memorized status from cached set', async () => {
    cacheService.getCache.mockResolvedValue(null);
    cacheService.getSetCache.mockResolvedValue(new Set(['__EMPTY__']));
    collectionRepo.getPrivateById.mockResolvedValue({
      words: {
        1: { id: 1, is_memorized: true },
      },
    });

    const result = await collectionService.getPrivateById({
      user_id: 'user-1',
      collection_id: '99',
    });

    expect(result.status).toBe(200);
    expect(result.data.memorizedCnt).toBe(0);
    expect(result.data.words[1].is_memorized).toBe(false);
  });

  it('hydrates collection stats via DB fallback', async () => {
    cacheService.getCache.mockResolvedValue(null);
    collectionRepo.getPaginatedByUserIdSortedByLastViewedAt.mockResolvedValue([
      { id: 1, word_cnt: 2, memorized_cnt: 1 },
    ]);

    const readPipeline = {
      hgetall: jest.fn(),
      exec: jest.fn().mockResolvedValue([[null, {}]]),
    };
    const writePipeline = {
      hset: jest.fn(),
      expire: jest.fn(),
      exec: jest.fn(),
    };
    cacheService.redis.pipeline.mockReturnValueOnce(readPipeline).mockReturnValueOnce(writePipeline);
    wordRepo.getWordStats.mockResolvedValue({ word_cnt: 5, memorized_cnt: 2 });

    const result = await collectionService.getPaginatedByUserIdSortedByLastViewedAt({
      user_id: 'user-1',
      offset: 0,
      limit: 10,
    });

    expect(writePipeline.hset).toHaveBeenCalled();
    expect(result.status).toBe(200);
    expect(result.data[0].word_cnt).toBe(2);
  });

  it('returns cached public collection search results', async () => {
    cacheService.getCache.mockResolvedValue([{ id: 10 }]);

    const result = await collectionService.searchPublicCollections({
      query: 'test',
      offset: 0,
      limit: 10,
    });

    expect(result).toEqual({ status: 200, data: [{ id: 10 }] });
  });
});
