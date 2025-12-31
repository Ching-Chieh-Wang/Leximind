jest.mock('../../../src/repositories/user', () => ({
  create: jest.fn(),
  getUserWithPasswordByEmail: jest.fn(),
  getById: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
}));

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

jest.mock('../../../src/services/c2Service', () => ({
  generateSignedUrl: jest.fn(),
  uploadProfileImage: jest.fn(),
}));

jest.mock('google-auth-library', () => {
  const verifyIdToken = jest.fn();
  const OAuth2Client = jest.fn().mockImplementation(() => ({ verifyIdToken }));
  return { OAuth2Client };
});

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepo = require('../../../src/repositories/user');
const c2Service = require('../../../src/services/c2Service');
const { OAuth2Client } = require('google-auth-library');

const userService = require('../../../src/services/userService');

describe('userService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret';
    process.env.CDN_URL = 'https://cdn.example.com/';
  });

  it('registers a new user and returns token', async () => {
    bcrypt.hash.mockResolvedValue('hashed');
    userRepo.create.mockResolvedValue({ id: 'u1', is_new_user: true });
    jwt.sign.mockReturnValue('token');

    const result = await userService.register({
      username: 'name',
      email: 'Test@Example.com',
      password: 'pass',
    });

    expect(userRepo.create).toHaveBeenCalledWith('name', 'test@example.com', 'credential', 'user', 'hashed');
    expect(result.status).toBe(201);
    expect(result.data.accessToken).toBe('token');
  });

  it('rejects register for existing user', async () => {
    bcrypt.hash.mockResolvedValue('hashed');
    userRepo.create.mockResolvedValue({ id: 'u1', is_new_user: false });

    const result = await userService.register({
      username: 'name',
      email: 'test@example.com',
      password: 'pass',
    });

    expect(result).toEqual({
      status: 409,
      error: { message: 'Email already in use. Please use a different email.' },
    });
  });

  it('logs in valid user', async () => {
    userRepo.getUserWithPasswordByEmail.mockResolvedValue({
      id: 'u1',
      password: 'hashed',
      role: 'user',
    });
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('token');

    const result = await userService.login({ email: 'TEST@EXAMPLE.COM', password: 'pass' });

    expect(userRepo.getUserWithPasswordByEmail).toHaveBeenCalledWith('test@example.com');
    expect(result.status).toBe(200);
    expect(result.data.accessToken).toBe('token');
  });

  it('returns 404 on invalid login', async () => {
    userRepo.getUserWithPasswordByEmail.mockResolvedValue(null);

    const result = await userService.login({ email: 'test@example.com', password: 'pass' });

    expect(result).toEqual({ status: 404, error: { message: 'Invalid email or password' } });
  });

  it('requires token for Google login', async () => {
    const result = await userService.googleLoginOrRegister({ token_id: '' });

    expect(result).toEqual({ status: 400, error: { message: 'Token ID is required' } });
  });

  it('logs in or registers via Google', async () => {
    const clientInstance = new OAuth2Client();
    clientInstance.verifyIdToken.mockResolvedValue({
      getPayload: () => ({ email: 'test@example.com', name: 'Test', picture: 'pic' }),
    });
    userRepo.create.mockResolvedValue({ id: 'u1', role: 'user' });
    jwt.sign.mockReturnValue('token');

    const result = await userService.googleLoginOrRegister({ token_id: 'token' });

    expect(userRepo.create).toHaveBeenCalledWith('Test', 'test@example.com', 'google', 'user', '', 'pic');
    expect(result.status).toBe(200);
    expect(result.data.accessToken).toBe('token');
  });

  it('returns profile with signed image', async () => {
    userRepo.getById.mockResolvedValue({ id: 'u1', image: 'img' });
    c2Service.generateSignedUrl.mockReturnValue('signed');

    const result = await userService.getProfile({ user_id: 'u1' });

    expect(result.status).toBe(200);
    expect(result.data.user.image).toBe('signed');
  });

  it('updates profile with new image', async () => {
    c2Service.uploadProfileImage.mockResolvedValue('path.png');
    userRepo.update.mockResolvedValue({ id: 'u1' });

    const result = await userService.update({
      user_id: 'u1',
      username: 'name',
      email: 'test@example.com',
      image: 'data',
      isNewImage: true,
    });

    expect(result.status).toBe(200);
    expect(result.data.image).toBe('https://cdn.example.com/path.png');
  });

  it('returns 404 when removing missing user', async () => {
    userRepo.remove.mockResolvedValue(null);

    const result = await userService.remove({ user_id: 'u1' });

    expect(result).toEqual({ status: 404, error: { message: 'User not found' } });
  });
});
