const request = require('supertest');
const app = require('../src/app');
const Task = require('../src/models/Task');

describe('Tasks API', () => {
  describe('POST /api/tasks', () => {
    it('should create a new task when title is provided', async () => {
      const res = await request(app).post('/api/tasks').send({
        title: 'Read CS textbook',
        description: 'Pages 112-120',
      });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.title).toBe('Read CS textbook');

      // Double check task was saved to test collection
      const dbTask = await Task.findById(res.body._id);
      expect(dbTask).not.toBeNull();
      expect(dbTask.title).toBe('Read CS textbook');
    });
  });
});
