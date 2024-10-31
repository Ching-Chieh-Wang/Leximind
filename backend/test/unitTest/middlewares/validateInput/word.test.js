const { validateWordInput } = require('@middlewares/validateInput/word');
const httpMocks = require('node-mocks-http');

describe('validateWordInput Middleware', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = httpMocks.createRequest();
    mockRes = httpMocks.createResponse();
    mockNext = jest.fn();
  });

  it('should pass validation when input is valid', async () => {
    mockReq.body = {
      name: 'Valid Word',
      description: 'This is a valid description for a word',
    };
    await validateWordInput[0](mockReq, mockRes, mockNext);
    await validateWordInput[1](mockReq, mockRes, mockNext);
    await validateWordInput[2](mockReq, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalled();
  });

  it('should fail if name is empty', async () => {
    mockReq.body = {
      name: '',
      description: 'Valid description',
    };

    await validateWordInput[0](mockReq, mockRes, mockNext);
    await validateWordInput[1](mockReq, mockRes, mockNext);
    await validateWordInput[2](mockReq, mockRes, mockNext);

    const message = mockRes._getJSONData().message;
    expect(mockRes.statusCode).toBe(400);
    expect(message[0].msg).toBe('name is required');
  });

  it('should fail if name contains only spaces', async () => {
    mockReq.body = {
      name: '   ',
      description: 'Valid description',
    };

    await validateWordInput[0](mockReq, mockRes, mockNext);
    await validateWordInput[1](mockReq, mockRes, mockNext);
    await validateWordInput[2](mockReq, mockRes, mockNext);

    const message = mockRes._getJSONData().message;
    expect(mockRes.statusCode).toBe(400);
    expect(message[0].msg).toBe('name is required');
  });

  it('should fail if name exceeds 100 characters', async () => {
    mockReq.body = {
      name: 'a'.repeat(101),
      description: 'Valid description',
    };

    await validateWordInput[0](mockReq, mockRes, mockNext);
    await validateWordInput[1](mockReq, mockRes, mockNext);
    await validateWordInput[2](mockReq, mockRes, mockNext);

    const message = mockRes._getJSONData().message;
    expect(mockRes.statusCode).toBe(400);
    expect(message[0].msg).toBe('name cannot be more than 100 characters long');
  });

  it('should fail if description is empty', async () => {
    mockReq.body = {
      name: 'Valid Word',
      description: '',
    };

    await validateWordInput[0](mockReq, mockRes, mockNext);
    await validateWordInput[1](mockReq, mockRes, mockNext);
    await validateWordInput[2](mockReq, mockRes, mockNext);

    const message = mockRes._getJSONData().message;
    expect(mockRes.statusCode).toBe(400);
    expect(message[0].msg).toBe('description is required');
  });


  it('should fail if description exceeds 500 characters', async () => {
    mockReq.body = {
      name: 'Valid Word',
      description: 'a'.repeat(501),
    };

    await validateWordInput[0](mockReq, mockRes, mockNext);
    await validateWordInput[1](mockReq, mockRes, mockNext);
    await validateWordInput[2](mockReq, mockRes, mockNext);

    const message = mockRes._getJSONData().message;
    expect(mockRes.statusCode).toBe(400);
    expect(message[0].msg).toBe('description cannot be more than 500 characters long');
  });

  it('should return multiple message if both name and description are invalid', async () => {
    mockReq.body = {
      name: '',
      description: 'a'.repeat(501),
    };

    await validateWordInput[0](mockReq, mockRes, mockNext);
    await validateWordInput[1](mockReq, mockRes, mockNext);
    await validateWordInput[2](mockReq, mockRes, mockNext);

    const message = mockRes._getJSONData().message;
    expect(mockRes.statusCode).toBe(400);
    expect(message.length).toBe(2);
    expect(message[0].msg).toBe('name is required');
    expect(message[1].msg).toBe('description cannot be more than 500 characters long');
  });
});