const { validateCollectionInput } = require('@middlewares/validateInput/collection');  // Adjust path accordingly
const { validationResult } = require('express-validator');
const httpMocks = require('node-mocks-http');

describe('validateCollectionInput middleware', () => {
  let mockReq, mockRes, next;

  beforeEach(() => {
    mockReq = httpMocks.createRequest();
    mockRes = httpMocks.createResponse();
    next = jest.fn();  // To mock the next function
  });

  it('should pass validation when valid name and description are provided', async () => {
    mockReq.body = {
      name: 'Valid Collection',
      description: 'This is a valid description'
    };

    await validateCollectionInput[0](mockReq, mockRes, next);
    await validateCollectionInput[1](mockReq, mockRes, next);
    await validateCollectionInput[2](mockReq, mockRes, next);

    expect(next).toHaveBeenCalled();  // Expect next middleware to be called
    expect(mockRes.statusCode).toBe(200);  // No errors, should proceed with status 200
  });

  it('should return an error if the name is missing', async () => {
    mockReq.body = { description: 'Valid description' };  // Missing name

    await validateCollectionInput[0](mockReq, mockRes, next);
    await validateCollectionInput[1](mockReq, mockRes, next);
    await validateCollectionInput[2](mockReq, mockRes, next);

    const responseData = mockRes._getJSONData();
    expect(mockRes.statusCode).toBe(400);
    expect(responseData.errors[0].msg).toBe('Collection name is required');
  });

  it('should return an error if the name exceeds 50 characters', async () => {
    mockReq.body = {
      name: 'a'.repeat(51),  // Exceeding 50 characters
      description: 'Valid description'
    };

    await validateCollectionInput[0](mockReq, mockRes, next);
    await validateCollectionInput[1](mockReq, mockRes, next);
    await validateCollectionInput[2](mockReq, mockRes, next);

    const responseData = mockRes._getJSONData();
    expect(mockRes.statusCode).toBe(400);
    expect(responseData.errors[0].msg).toBe('Collection name cannot be more than 50 characters long');
  });

  it('should return an error if the name contains invalid characters', async () => {
    mockReq.body = {
      name: 'Invalid@Name!',
      description: 'Valid description'
    };

    await validateCollectionInput[0](mockReq, mockRes, next);
    await validateCollectionInput[1](mockReq, mockRes, next);
    await validateCollectionInput[2](mockReq, mockRes, next);

    const responseData = mockRes._getJSONData();
    expect(mockRes.statusCode).toBe(400);
    expect(responseData.errors[0].msg).toBe('Collection name can only contain letters, numbers, and spaces');
  });

  it('should return an error if the description exceeds 500 characters', async () => {
    mockReq.body = {
      name: 'Valid Collection',
      description: 'a'.repeat(501)  // Exceeding 500 characters
    };

    await validateCollectionInput[0](mockReq, mockRes, next);
    await validateCollectionInput[1](mockReq, mockRes, next);
    await validateCollectionInput[2](mockReq, mockRes, next);

    const responseData = mockRes._getJSONData();
    expect(mockRes.statusCode).toBe(400);
    expect(responseData.errors[0].msg).toBe('Description cannot be more than 500 characters long');
  });

  it('should pass if description is optional and not provided', async () => {
    mockReq.body = { name: 'Valid Collection' };  // No description provided

    await validateCollectionInput[0](mockReq, mockRes, next);
    await validateCollectionInput[1](mockReq, mockRes, next);
    await validateCollectionInput[2](mockReq, mockRes, next);

    expect(next).toHaveBeenCalled();  // Expect next middleware to be called
  });
});