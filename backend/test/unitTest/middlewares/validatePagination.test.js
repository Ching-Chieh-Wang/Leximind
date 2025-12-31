const { validatePagination } = require('@middlewares/validatePagination');

describe('validatePagination Middleware', () => {
  let mockReq, mockRes, nextFunction;

  beforeEach(() => {
    mockReq = { query: {} }; // Initialize with empty query object
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn(); // Mock next function
  });

  it('should call next if page and limit are valid', () => {
    mockReq.query.page = '2';  // Page is a valid number as string
    mockReq.query.limit = '10'; // Limit is a valid number as string

    validatePagination(mockReq, mockRes, nextFunction);

    // Expect next to be called and no errors
    expect(nextFunction).toHaveBeenCalled();
    expect(mockRes.status).not.toHaveBeenCalled();
    expect(mockReq.limit).toBe(10);
    expect(mockReq.offset).toBe(10);
  });

  

  it('should return 400 if page is not a positive integer', () => {
    mockReq.query.page = '-1';
    mockReq.query.limit = '10';

    validatePagination(mockReq, mockRes, nextFunction);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: '"page" must be a positive integer',
    });
  });

  it('should return 400 if page is not a number', () => {
  mockReq.query.page = 'abc';
  mockReq.query.limit = '10';

  validatePagination(mockReq, mockRes, nextFunction);

  expect(mockRes.status).toHaveBeenCalledWith(400);
  expect(mockRes.json).toHaveBeenCalledWith({
    message: '"page" must be a positive integer',
    });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should return 400 if limit is not a number', () => {
    mockReq.query.page = '10';
    mockReq.query.limit = 'xyz';  // Invalid non-numeric limit

    validatePagination(mockReq, mockRes, nextFunction);

    // Expect a 400 response with error message
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ message: '"limit" must be a positive integer' });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should call next if page and limit are missing', () => {
    // No page or limit provided
    validatePagination(mockReq, mockRes, nextFunction);

    // Expect next to be called without errors
    expect(nextFunction).toHaveBeenCalled();
    expect(mockRes.status).not.toHaveBeenCalled();
  });

  it('should return 400 if only page is provided', () => {
    mockReq.query.page = '1';

    validatePagination(mockReq, mockRes, nextFunction);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: '"page" and "limit" togethered are required query parameters',
    });
  });

  it('should return 400 if only limit is provided', () => {
    mockReq.query.limit = '10';

    validatePagination(mockReq, mockRes, nextFunction);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: '"page" and "limit" togethered are required query parameters',
    });
  });
});
