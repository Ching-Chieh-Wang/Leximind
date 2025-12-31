const wordRepo = require('../../../src/repositories/word');
const cacheService = require('../../../src/services/cacheService');
const c2Service = require('../../../src/services/c2Service');
const { text2SpeechServce } = require('../../../src/services/text2SpeechService');

const wordService = require('../../../src/services/wordService');

jest.mock('../../../src/repositories/word', () => ({
  create: jest.fn(),
  remove: jest.fn(),
  update: jest.fn(),
  getByLabelId: jest.fn(),
  getUnmemorized: jest.fn(),
  searchByPrefix: jest.fn(),
  getMemorizedWordIds: jest.fn(),
  getById: jest.fn(),
}));

jest.mock('../../../src/services/cacheService', () => ({
  getCache: jest.fn(),
  setCache: jest.fn(),
  removeCache: jest.fn(),
  existsCache: jest.fn(),
  setSetCache: jest.fn(),
  saddCache: jest.fn(),
  sremCache: jest.fn(),
  xaddCache: jest.fn(),
}));

jest.mock('../../../src/services/c2Service', () => ({
  generateSignedUrl: jest.fn(),
  exists: jest.fn(),
  uploadAudio: jest.fn(),
}));

jest.mock('../../../src/services/text2SpeechService', () => ({
  text2SpeechServce: {
    generate: jest.fn(),
  },
}));

describe('wordService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates a word and clears caches', async () => {
    wordRepo.create.mockResolvedValue({ id: 1 });

    const result = await wordService.create({
      user_id: 'u1',
      collection_id: '10',
      name: 'Word',
      description: 'Desc',
      img_path: 'img',
      label_ids: [],
    });

    expect(result).toEqual({ status: 201, data: { id: 1 } });
    expect(cacheService.removeCache).toHaveBeenCalled();
  });

  it('returns 404 when memorized cache rebuild fails', async () => {
    cacheService.existsCache.mockResolvedValue(false);
    wordRepo.getMemorizedWordIds.mockResolvedValue(null);

    const result = await wordService.changeIsMemorizedStatus({
      user_id: 'u1',
      collection_id: '10',
      word_id: '3',
      is_memorized: true,
    });

    expect(result).toEqual({ status: 404, error: { message: 'Words not found or unauthorized' } });
  });

  it('updates memorized cache and enqueues event', async () => {
    cacheService.existsCache.mockResolvedValue(true);

    const result = await wordService.changeIsMemorizedStatus({
      user_id: 'u1',
      collection_id: '10',
      word_id: '3',
      is_memorized: true,
    });

    expect(cacheService.saddCache).toHaveBeenCalledWith(
      'user:u1:collection:private:10:memorized',
      '3'
    );
    expect(cacheService.xaddCache).toHaveBeenCalled();
    expect(result.status).toBe(200);
  });

  it('generates text-to-speech audio and returns signed URL', async () => {
    cacheService.getCache.mockResolvedValue(null);
    wordRepo.getById.mockResolvedValue({ id: 1, name: 'Hello' });
    c2Service.exists.mockResolvedValue(false);
    text2SpeechServce.generate.mockResolvedValue(Buffer.from('audio'));
    c2Service.uploadAudio.mockResolvedValue();
    c2Service.generateSignedUrl.mockResolvedValue('signed-url');

    const result = await wordService.textToSpeech({ user_id: 'u1', word_id: '1' });

    expect(text2SpeechServce.generate).toHaveBeenCalledWith('hello');
    expect(result).toEqual({ status: 200, data: { url: 'signed-url' } });
  });
});
