import request from 'supertest';
import { app, server } from './index.js';
import { secretToken as secretTokenConfig } from './config.js';

const secretToken = process.env.SECRETTOKEN || secretTokenConfig;

test('returns a list of public users', async () => {
  const response = await request(app).get(`/${secretToken}/public-users`);
  expect(response.status).toBe(200);
  expect(Array.isArray(response.body)).toBe(true);
  response.body.forEach((user) => {
    expect(typeof user.id).toBe('string');
    expect(user.isPublic).toBe(true);
    expect(typeof user.nickname).toBe('string');
  });
});

test('returns a list of all settings', async () => {
  const response = await request(app).get(`/${secretToken}/settings`);
  expect(response.status).toBe(200);
  response.body.forEach((setting) => {
    expect(typeof setting.id).toBe('string');
    expect(typeof setting.isPublic).toBe('boolean');
    expect(typeof setting.nickname).toBe('string');
  });
});

test('returns featured items in json format', async () => {
  const response = await request(app).get(`/${secretToken}/featured`);
  expect(response.status).toBe(200);
  expect(typeof response.body).toBe('object');
});

describe('GET /users', () => {
  let userList = [];
  test('returns a list of all users', async () => {
    const response = await request(app).get(`/${secretToken}/users`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    response.body.forEach((user) => {
      userList.push(user.userId);
      expect(typeof user.userId).toBe('string');
      expect(typeof user.created_at).toBe('string');
      expect(typeof user.friends).toBe('object'); // "object" type is actually "null", because I have not developed this feature yet
    });
  });

  test('checks if there are duplicate userIds in the users endpoint', async () => {
    var duplicatesFound = false;
    const response = await request(app).get(`/${secretToken}/users`);
    let findDuplicates = (arr) =>
      arr.filter((item, index) => arr.indexOf(item) !== index);
    if (findDuplicates(response.body) != '') {
      console.log('Duplicates found!');
      duplicatesFound = true;
    }
    expect(duplicatesFound).toBe(false);
  });

  test('tests if a every specific user can be returned from users/:userId endpoint', async () => {
    let responses = [];
    userList.forEach(async (user, index) => {
      const response = await request(app).get(
        `/${secretToken}/users/${userList[index]}`
      );
      expect(response.status).toBe(200);
      expect(typeof response.body).toBe('object');
      responses.push(response);
    });
  });
});

afterAll(async () => {
  server.close();
});
