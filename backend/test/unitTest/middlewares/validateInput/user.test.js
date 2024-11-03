const { validateRegister, validateLogin, validateProfile } = require('@middlewares/validateInput/user');
const httpMocks = require('node-mocks-http');

describe('Validation Middleware Tests', () => {

  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = httpMocks.createRequest();
    mockRes = httpMocks.createResponse();
    mockNext = jest.fn();
  });

  // Tests for validateRegister
  describe('validateRegister', () => {
    it('should pass when input is valid', async () => {
      mockReq.body = {
        username: 'validuser',
        email: 'validemail@example.com',
        password: 'ValidPass1!',
      };
      
      await validateRegister[0](mockReq, mockRes, mockNext);
      await validateRegister[1](mockReq, mockRes, mockNext);
      await validateRegister[2](mockReq, mockRes, mockNext);
      await validateRegister[3](mockReq, mockRes, mockNext);
      
      expect(mockNext).toHaveBeenCalled();
    });

    it('should fail when username is empty', async () => {
      mockReq.body = {
        username: '',
        email: 'validemail@example.com',
        password: 'ValidPass1!',
      };
      
      await validateRegister[0](mockReq, mockRes, mockNext);
      await validateRegister[1](mockReq, mockRes, mockNext);
      await validateRegister[2](mockReq, mockRes, mockNext);
      await validateRegister[3](mockReq, mockRes, mockNext);
      
      const data = mockRes._getJSONData();
      expect(mockRes.statusCode).toBe(400);
      expect(data.message).toBe('invalid input');
      expect(data.errors[0].msg).toBe('Username is required');
    });

    it('should fail when email is invalid', async () => {
      mockReq.body = {
        username: 'validuser',
        email: 'invalidemail',
        password: 'ValidPass1!',
      };
      
      await validateRegister[0](mockReq, mockRes, mockNext);
      await validateRegister[1](mockReq, mockRes, mockNext);
      await validateRegister[2](mockReq, mockRes, mockNext);
      await validateRegister[3](mockReq, mockRes, mockNext);
      
      const data = mockRes._getJSONData();
      expect(mockRes.statusCode).toBe(400);
      expect(data.message).toBe('invalid input');
      expect(data.errors[0].msg).toBe('Invalid email address');
    });

    it('should fail when password is missing a special character', async () => {
      mockReq.body = {
        username: 'validuser',
        email: 'validemail@example.com',
        password: 'ValidPass1',
      };
      
      await validateRegister[0](mockReq, mockRes, mockNext);
      await validateRegister[1](mockReq, mockRes, mockNext);
      await validateRegister[2](mockReq, mockRes, mockNext);
      await validateRegister[3](mockReq, mockRes, mockNext);
      
      const data = mockRes._getJSONData();      expect(mockRes.statusCode).toBe(400);
      expect(data.message).toBe('invalid input');
      expect(data.errors[0].msg).toBe('Password must contain at least one special character');
    });

    it('should fail when username is whitespace only', async () => {
      mockReq.body = {
        username: '   ',
        email: 'validemail@example.com',
        password: 'ValidPass1!',
      };
      
      await validateRegister[0](mockReq, mockRes, mockNext);
      await validateRegister[1](mockReq, mockRes, mockNext);
      await validateRegister[2](mockReq, mockRes, mockNext);
      await validateRegister[3](mockReq, mockRes, mockNext);
      
      const data = mockRes._getJSONData();
      expect(mockRes.statusCode).toBe(400);
      expect(data.message).toBe('invalid input');
      expect(data.errors[0].msg).toBe('Username is required');
    });

    it('should fail when password exceeds length limit', async () => {
      mockReq.body = {
        username: 'validuser',
        email: 'validemail@example.com',
        password: 'A'.repeat(61) + 'a1!',
      };
      
      await validateRegister[0](mockReq, mockRes, mockNext);
      await validateRegister[1](mockReq, mockRes, mockNext);
      await validateRegister[2](mockReq, mockRes, mockNext);
      await validateRegister[3](mockReq, mockRes, mockNext);
      
      const data = mockRes._getJSONData();
      expect(mockRes.statusCode).toBe(400);
      expect(data.message).toBe('invalid input');
      expect(data.errors[0].msg).toBe('Password must be less than 60 characters long');
    });

    it('should fail when username is too short', async () => {
      mockReq.body = {
        username: 'ab',
        email: 'validemail@example.com',
        password: 'ValidPass1!',
      };
      
      await validateRegister[0](mockReq, mockRes, mockNext);
      await validateRegister[1](mockReq, mockRes, mockNext);
      await validateRegister[2](mockReq, mockRes, mockNext);
      await validateRegister[3](mockReq, mockRes, mockNext);
      
      const data = mockRes._getJSONData();
      expect(mockRes.statusCode).toBe(400);
      expect(data.message).toBe('invalid input');
      expect(data.errors[0].msg).toBe('Username must be at least 3 characters long');
    });

    it('should fail when username exceeds length limit', async () => {
      mockReq.body = {
        username: 'a'.repeat(51),
        email: 'validemail@example.com',
        password: 'ValidPass1!',
      };
      
      await validateRegister[0](mockReq, mockRes, mockNext);
      await validateRegister[1](mockReq, mockRes, mockNext);
      await validateRegister[2](mockReq, mockRes, mockNext);
      await validateRegister[3](mockReq, mockRes, mockNext);
      
      const data = mockRes._getJSONData();
      expect(mockRes.statusCode).toBe(400);
      expect(data.message).toBe('invalid input');
      expect(data.errors[0].msg).toBe('Username cannot be more than 50 characters long');
    });

    it('should fail when email exceeds length limit', async () => {
      mockReq.body = {
        username: 'validuser',
        email: 'a'.repeat(61) + '@example.com',
        password: 'ValidPass1!',
      };
      
      await validateRegister[0](mockReq, mockRes, mockNext);
      await validateRegister[1](mockReq, mockRes, mockNext);
      await validateRegister[2](mockReq, mockRes, mockNext);
      await validateRegister[3](mockReq, mockRes, mockNext);
      
      const data = mockRes._getJSONData();
      expect(mockRes.statusCode).toBe(400);
      expect(data.message).toBe('invalid input');
      expect(data.errors[0].msg).toBe('Email cannot be more than 60 characters long');
    });
  });

  

  // Tests for validateProfile
  describe('validateProfile', () => {
    it('should pass when input is valid', async () => {
      mockReq.body = {
        username: 'validuser',
        email: 'validemail@example.com',
      };
      
      await validateProfile[0](mockReq, mockRes, mockNext);
      await validateProfile[1](mockReq, mockRes, mockNext);
      await validateProfile[2](mockReq, mockRes, mockNext);
      
      expect(mockNext).toHaveBeenCalled();
    });

    it('should fail when username contains non-alphanumeric characters', async () => {
      mockReq.body = {
        username: 'invalid@name!',
        email: 'validemail@example.com',
      };
      
      await validateProfile[0](mockReq, mockRes, mockNext);
      await validateProfile[1](mockReq, mockRes, mockNext);
      await validateProfile[2](mockReq, mockRes, mockNext);
      
      const data = mockRes._getJSONData();
      expect(mockRes.statusCode).toBe(400);
      expect(data.errors[0].msg).toBe('Username must be alphanumeric');
    });

    it('should fail when email is invalid', async () => {
      mockReq.body = {
        username: 'validuser',
        email: 'invalidemail',
      };
      
      await validateProfile[0](mockReq, mockRes, mockNext);
      await validateProfile[1](mockReq, mockRes, mockNext);
      await validateProfile[2](mockReq, mockRes, mockNext);
      
      const data = mockRes._getJSONData();
      expect(mockRes.statusCode).toBe(400);
      expect(data.errors[0].msg).toBe('Invalid email address');
    });
  });
});