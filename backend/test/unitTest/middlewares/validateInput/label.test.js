const { validateLabelInput } = require('@middlewares/validateInput/label');
const httpMocks = require('node-mocks-http');
const { validationResult } = require('express-validator');

describe('validateLabelInput Middleware', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = httpMocks.createRequest();
    mockRes = httpMocks.createResponse();
    mockNext = jest.fn();
  });

  it('should pass validation for valid label name', async () => {
    mockReq.body = { name: 'Valid Label' };

    await validateLabelInput[0](mockReq, mockRes, mockNext); // Trigger validation for 'name'
    await validateLabelInput[1](mockReq, mockRes, mockNext); // Check validation result

    expect(mockNext).toHaveBeenCalled();
    expect(mockRes.statusCode).toBe(200);
  });

  it('should fail if label name is missing', async () => {
    mockReq.body = { name: '' };

    await validateLabelInput[0](mockReq, mockRes, mockNext);
    await validateLabelInput[1](mockReq, mockRes, mockNext);

    expect(mockRes.statusCode).toBe(400);
    const data = mockRes._getJSONData();
    expect(data.message[0].msg).toBe('Label name is required');
  });

  it('should fail if label name is too long (more than 50 characters)', async () => {
    mockReq.body = { name: 'A'.repeat(51) };

    await validateLabelInput[0](mockReq, mockRes, mockNext);
    await validateLabelInput[1](mockReq, mockRes, mockNext);

    expect(mockRes.statusCode).toBe(400);
    const data = mockRes._getJSONData();
    expect(data.message[0].msg).toBe('Label name cannot be more than 50 characters long');
  });

  it('should fail if label name contains invalid characters', async () => {
    mockReq.body = { name: 'Invalid@Name!' };

    await validateLabelInput[0](mockReq, mockRes, mockNext);
    await validateLabelInput[1](mockReq, mockRes, mockNext);

    expect(mockRes.statusCode).toBe(400);
    const data = mockRes._getJSONData();
    expect(data.message[0].msg).toBe('Label name can only contain letters, numbers, and spaces');
  });

  it('should fail if label name contains only spaces', async () => {
    mockReq.body = { name: '    ' };

    await validateLabelInput[0](mockReq, mockRes, mockNext);
    await validateLabelInput[1](mockReq, mockRes, mockNext);

    expect(mockRes.statusCode).toBe(400);
    const data = mockRes._getJSONData();
    expect(data.message[0].msg).toBe('Label name is required');
  });

  it('should trim spaces from label name and pass if valid', async () => {
    mockReq.body = { name: '   Valid Label   ' };

    await validateLabelInput[0](mockReq, mockRes, mockNext);
    await validateLabelInput[1](mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockRes.statusCode).toBe(200);
  });
});