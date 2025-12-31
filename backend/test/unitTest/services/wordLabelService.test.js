const wordLabelRepo = require('../../../src/repositories/word_label');
const cacheService = require('../../../src/services/cacheService');

const wordLabelService = require('../../../src/services/wordLabelService');

jest.mock('../../../src/repositories/word_label', () => ({
  addWordToLabel: jest.fn(),
  removeWordFromLabel: jest.fn(),
}));

jest.mock('../../../src/services/cacheService', () => ({
  removeCache: jest.fn(),
}));

describe('wordLabelService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 400 on collection mismatch error', async () => {
    const error = { code: '23514' };
    wordLabelRepo.addWordToLabel.mockRejectedValue(error);

    const result = await wordLabelService.addWordToLabel({
      user_id: 'u1',
      label_id: '1',
      word_id: '2',
      collection_id: '3',
    });

    expect(result).toEqual({
      status: 400,
      error: { message: 'Word and label must belong to the same collection' },
    });
  });

  it('returns 404 when association not found', async () => {
    wordLabelRepo.removeWordFromLabel.mockResolvedValue(false);

    const result = await wordLabelService.removeWordFromLabel({
      user_id: 'u1',
      label_id: '1',
      word_id: '2',
      collection_id: '3',
    });

    expect(result.status).toBe(404);
  });
});
