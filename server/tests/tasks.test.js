const request = require('supertest');
const app = require('../src/app');
const Task = require('../src/models/Task');

// A syntactically valid ObjectId that will never match a real document
const fakeId = '000000000000000000000000';

// A malformed id — not a valid ObjectId at all, so the middleware must
// reject it with 400 before Mongoose ever sees it
const invalidId = 'abc';

describe('Tasks API', () => {
  describe('POST /api/tasks', () => {
    // Happy path: creating a task with all fields
    it('should create a new task when title is provided', async () => {
      const res = await request(app).post('/api/tasks').send({
        title: 'Read CS textbook',
        description: 'Pages 112-120',
        dueDate: '2026-06-15',
        tags: ['school', 'reading'],
      });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.title).toBe('Read CS textbook');
      expect(res.body.dueDate).toBe('2026-06-15');
      expect(res.body.tags).toEqual(['school', 'reading']);

      // Double check task was saved to test collection
      const dbTask = await Task.findById(res.body._id);
      expect(dbTask).not.toBeNull();
      expect(dbTask.title).toBe('Read CS textbook');
    });

    // Happy path: schema defaults apply when only a title is sent
    it('should apply defaults (completed: false, empty description and tags)', async () => {
      const res = await request(app).post('/api/tasks').send({ title: 'Minimal task' });

      expect(res.statusCode).toBe(201);
      expect(res.body.completed).toBe(false);
      expect(res.body.description).toBe('');
      expect(res.body.tags).toEqual([]);
    });

    // Sad path: title is required
    it('should return 400 if title is missing', async () => {
      const res = await request(app).post('/api/tasks').send({ description: 'No title' });
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error', 'Task title is required');
    });

    // Sad path: a whitespace-only title must be rejected by the trim() check
    it('should return 400 if title is only whitespace', async () => {
      const res = await request(app).post('/api/tasks').send({ title: '   ' });
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error', 'Task title is required');
    });
  });

  describe('GET /api/tasks', () => {
    // Happy path: unlike habits, tasks have no isActive filter — everything comes back
    it('should return all tasks, both pending and completed', async () => {
      await Task.create([
        { title: 'Pending task' },
        { title: 'Done task', completed: true },
      ]);

      const res = await request(app).get('/api/tasks');

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(2);
      const titles = res.body.map((t) => t.title);
      expect(titles).toContain('Pending task');
      expect(titles).toContain('Done task');
    });

    it('should return an empty array when no tasks exist', async () => {
      const res = await request(app).get('/api/tasks');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([]);
    });
  });

  describe('PATCH /api/tasks/:id', () => {
    // Happy path: updating all editable fields returns the updated document
    it('should update title, description, dueDate, and tags', async () => {
      const task = await Task.create({ title: 'Old title' });

      const res = await request(app).patch(`/api/tasks/${task._id}`).send({
        title: 'New title',
        description: 'New description',
        dueDate: '2026-07-01',
        tags: ['updated'],
      });

      expect(res.statusCode).toBe(200);
      // The controller returns the updated document (returnDocument: 'after')
      expect(res.body.title).toBe('New title');
      expect(res.body.description).toBe('New description');
      expect(res.body.dueDate).toBe('2026-07-01');
      expect(res.body.tags).toEqual(['updated']);
    });

    // Edge case: completed is not an editable field on this endpoint.
    // The controller only picks title/description/dueDate/tags from the body,
    // so a client cannot toggle completion through a metadata edit.
    it('should ignore a completed field sent in the edit body', async () => {
      const task = await Task.create({ title: 'Stay pending' });

      const res = await request(app)
        .patch(`/api/tasks/${task._id}`)
        .send({ title: 'Stay pending', completed: true });

      expect(res.statusCode).toBe(200);
      expect(res.body.completed).toBe(false);

      const dbTask = await Task.findById(task._id);
      expect(dbTask.completed).toBe(false);
    });

    // Sad path: title is required on edits too
    it('should return 400 if title is missing', async () => {
      const task = await Task.create({ title: 'Valid task' });

      const res = await request(app)
        .patch(`/api/tasks/${task._id}`)
        .send({ description: 'No title here' });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error', 'Task title is required');
    });

    // Sad path: the task does not exist
    it('should return 404 for a non-existent task', async () => {
      const res = await request(app).patch(`/api/tasks/${fakeId}`).send({ title: 'Anything' });
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error', 'Task not found');
    });

    // Sad path: a malformed ObjectId must be a 400 (client error), not a 500
    it('should return 400 for a malformed task id', async () => {
      const res = await request(app).patch(`/api/tasks/${invalidId}`).send({ title: 'Anything' });
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error', 'Invalid id format');
    });
  });

  describe('PATCH /api/tasks/:id/complete', () => {
    // Happy path: marking a pending task as completed
    it('should set completed to true and return the updated task', async () => {
      const task = await Task.create({ title: 'Finish me' });

      const res = await request(app).patch(`/api/tasks/${task._id}/complete`);

      expect(res.statusCode).toBe(200);
      expect(res.body.completed).toBe(true);

      // Verify the change was persisted
      const dbTask = await Task.findById(task._id);
      expect(dbTask.completed).toBe(true);
    });

    // Sad path: the task does not exist
    it('should return 404 for a non-existent task', async () => {
      const res = await request(app).patch(`/api/tasks/${fakeId}/complete`);
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error', 'Task not found');
    });

    // Sad path: a malformed ObjectId must be a 400 (client error), not a 500
    it('should return 400 for a malformed task id', async () => {
      const res = await request(app).patch(`/api/tasks/${invalidId}/complete`);
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error', 'Invalid id format');
    });
  });

  describe('PATCH /api/tasks/:id/uncomplete', () => {
    // Happy path: reverting a completed task back to pending
    it('should set completed to false and return the updated task', async () => {
      const task = await Task.create({ title: 'Undo me', completed: true });

      const res = await request(app).patch(`/api/tasks/${task._id}/uncomplete`);

      expect(res.statusCode).toBe(200);
      expect(res.body.completed).toBe(false);

      // Verify the change was persisted
      const dbTask = await Task.findById(task._id);
      expect(dbTask.completed).toBe(false);
    });

    // Sad path: the task does not exist
    it('should return 404 for a non-existent task', async () => {
      const res = await request(app).patch(`/api/tasks/${fakeId}/uncomplete`);
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error', 'Task not found');
    });

    // Sad path: a malformed ObjectId must be a 400 (client error), not a 500
    it('should return 400 for a malformed task id', async () => {
      const res = await request(app).patch(`/api/tasks/${invalidId}/uncomplete`);
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error', 'Invalid id format');
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    // Happy path: tasks are hard-deleted, unlike habits which are soft-deleted
    it('should permanently remove the task from the database', async () => {
      const task = await Task.create({ title: 'Delete me' });

      const res = await request(app).delete(`/api/tasks/${task._id}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Task deleted');

      // The document must be gone entirely — no isActive flag for tasks
      const dbTask = await Task.findById(task._id);
      expect(dbTask).toBeNull();
    });

    // Sad path: the task does not exist
    it('should return 404 for a non-existent task', async () => {
      const res = await request(app).delete(`/api/tasks/${fakeId}`);
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error', 'Task not found');
    });

    // Sad path: a malformed ObjectId must be a 400 (client error), not a 500
    it('should return 400 for a malformed task id', async () => {
      const res = await request(app).delete(`/api/tasks/${invalidId}`);
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error', 'Invalid id format');
    });
  });
});
