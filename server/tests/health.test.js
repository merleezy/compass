const request = require('supertest');
const app = require('../src/app');

describe('Health Route API', () => {
  it('should return 200 OK and a success message', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: 'Compass API is running' });
  });
});
