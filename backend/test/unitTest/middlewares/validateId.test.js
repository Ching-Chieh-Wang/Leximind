const { validateCollectionId } = require('@middlewares/validateId/collection');
const { validateLabelId } = require('@middlewares/validateId/label');
const { validateWordId } = require('@middlewares/validateId/word');

describe('validateId middlewares', () => {
  let mockReq;
  let mockRes;
  let nextFunction;

  beforeEach(() => {
    mockReq = { params: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
  });

  it('rejects invalid collection_id', async () => {
    mockReq.params.collection_id = 'abc';

    await validateCollectionId(mockReq, mockRes, nextFunction);

    expect(mockRes.status).toHaveBeenCalledWith(400);
  });

  it('rejects overflow label_id', async () => {
    mockReq.params.label_id = '2147483648';

    await validateLabelId(mockReq, mockRes, nextFunction);

    expect(mockRes.status).toHaveBeenCalledWith(400);
  });

  it('accepts valid word_id', async () => {
    mockReq.params.word_id = '12';

    await validateWordId(mockReq, mockRes, nextFunction);

    expect(nextFunction).toHaveBeenCalled();
  });
});
