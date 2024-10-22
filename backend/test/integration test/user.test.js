// test/user.test.js
const request = require('supertest');
const app = require('server'); // Ensure server.js exports the app
const db = require('@db/db');

const cleanDatabase = async () => {
  await db.query('DELETE FROM users;');
};

beforeAll(async () => {
  // Connect to the database
  await db.connectToDatabase();
});

beforeEach(async () => {
  // Clean up the database before each test
  await cleanDatabase();
});

afterAll(async () => {
  // Close the database connection after all tests
  await db.pool.end();
});

describe('User API Integration Tests', () => {
  const userData = {
    username: 'testuser',
    email: 'testuser@example.com',
    password: 'Password123!',
  };

  test('User Registration - Success', async () => {
    const res = await request(app).post('/api/users/register').send(userData);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toHaveProperty('email', userData.email);
    expect(res.body.user).toHaveProperty('username', userData.username);
  });

  test('User Registration - Email Already Exists', async () => {
    // Register the user first
    await request(app).post('/api/users/register').send(userData);

    // Attempt to register again with the same email
    const res = await request(app).post('/api/users/register').send(userData);

    expect(res.statusCode).toEqual(409);
    expect(res.body).toHaveProperty('message', 'Email already in use. Please use a different email.');
  });

  test('User Registration - Invalid Email', async () => {
    const res = await request(app).post('/api/users/register').send({
      ...userData,
      email: 'invalid-email',
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body.errors[0]).toHaveProperty('msg', 'Invalid email address');
  });

  test('User Login - Success', async () => {
    // Register the user first
    await request(app).post('/api/users/register').send(userData);

    // Attempt to log in
    const res = await request(app).post('/api/users/login').send({
      email: userData.email,
      password: userData.password,
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toHaveProperty('email', userData.email);
  });

  test('User Login - Invalid Password', async () => {
    // Register the user first
    await request(app).post('/api/users/register').send(userData);

    // Attempt to log in with wrong password
    const res = await request(app).post('/api/users/login').send({
      email: userData.email,
      password: 'WrongPassword123!',
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message', 'Invalid email or password');
  });

  test('Get User Profile - Success', async () => {
    // Register and log in to get the token
    const registerRes = await request(app).post('/api/users/register').send(userData);
    const token = registerRes.body.token;

    // Get user profile
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.user).toHaveProperty('email', userData.email);
    expect(res.body.user).toHaveProperty('username', userData.username);
  });

  test('Get User Profile - Unauthorized', async () => {
    const res = await request(app).get('/api/users');

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('message', 'Unauthorized: No token provided');
  });

  test('Update User Profile - Success', async () => {
    // Register and log in to get the token
    const registerRes = await request(app).post('/api/users/register').send(userData);
    const token = registerRes.body.token;

    // Update user profile
    const res = await request(app)
      .put('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        username: 'updateduser',
        email: 'updateduser@example.com',
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.user).toHaveProperty('email', 'updateduser@example.com');
    expect(res.body.user).toHaveProperty('username', 'updateduser');
  });

  test('Update User Profile - Email Already Exists', async () => {
    // Register another user
    await request(app).post('/api/users/register').send({
      username: 'anotheruser',
      email: 'anotheruser@example.com',
      password: 'Password123!',
    });

    // Register and log in to get the token
    const registerRes = await request(app).post('/api/users/register').send(userData);
    const token = registerRes.body.token;

    // Attempt to update email to an existing email
    const res = await request(app)
      .put('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        username: 'testuser',
        email: 'anotheruser@example.com',
      });

    expect(res.statusCode).toEqual(409);
    expect(res.body).toHaveProperty('message', 'Email already in use. Please use a different email.');
  });

  test('Delete User Profile - Success', async () => {
    // Register and log in to get the token
    const registerRes = await request(app).post('/api/users/register').send(userData);
    const token = registerRes.body.token;

    // Delete user profile
    const res = await request(app)
      .delete('/api/users')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'User deleted successfully');

    // Verify the user is deleted by attempting to log in
    const loginRes = await request(app).post('/api/users/login').send({
      email: userData.email,
      password: userData.password,
    });

    expect(loginRes.statusCode).toEqual(404);
    expect(loginRes.body).toHaveProperty('message', 'Invalid email or password');
  });
});