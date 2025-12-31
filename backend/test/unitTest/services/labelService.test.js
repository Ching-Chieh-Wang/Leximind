const labelRepo = require('../../../src/repositories/label');
const cacheService = require('../../../src/services/cacheService');

const labelService = require('../../../src/services/labelService');

jest.mock('../../../src/repositories/label', () => ({
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
}));

jest.mock('../../../src/services/cacheService', () => ({
  removeCache: jest.fn(),
}));

describe('labelService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns validation error on duplicate label name', async () => {
    const error = { code: '23505' };
    labelRepo.create.mockRejectedValue(error);

    const result = await labelService.create({
      user_id: 'u1',
      collection_id: '1',
      name: 'dup',
    });

    expect(result.status).toBe(400);
    expect(result.error.message.invalidArguments[0].path).toBe('name');
  });

  it('returns 404 when label update fails', async () => {
    labelRepo.update.mockResolvedValue(null);

    const result = await labelService.update({
      user_id: 'u1',
      collection_id: '1',
      label_id: '2',
      name: 'new',
    });

    expect(result).toEqual({ status: 404, error: { message: 'Label not found' } });
  });
});
