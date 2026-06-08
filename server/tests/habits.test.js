const request = require('supertest');
const app = require('../src/app');
const Habit = require('../src/models/Habit');
const HabitLog = require('../src/models/HabitLog');

// These date helpers mirror the logic in habitController.js so our test
// setup data (e.g. lastLoggedDate: yesterday) is always in sync with what
// the controller computes at request time.
const getTodayString = () => new Date().toISOString().split('T')[0];
const subtractDays = (dateStr, days) => {
  // Anchor to noon UTC to avoid edge cases where midnight rolls over during a test run
  const d = new Date(dateStr + 'T12:00:00Z');
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().split('T')[0];
};

const today = getTodayString();
const yesterday = subtractDays(today, 1);

describe('Habits API', () => {
  // Happy path: creating a habit
  describe('POST /api/habits', () => {
    it('should create a new habit when name is provided', async () => {
      const res = await request(app).post('/api/habits').send({
        name: 'Drink water',
        description: 'Drink 8 glasses of water daily',
      });
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.name).toBe('Drink water');

      // Double check that the habit was actually saved to the test collection
      const dbHabit = await Habit.findById(res.body._id);
      expect(dbHabit).not.toBeNull();
      expect(dbHabit.name).toBe('Drink water');
    });

    // Sad path: creating a habit with missing name
    it('should return 400 if name is missing', async () => {
      const res = await request(app).post('/api/habits').send({ description: 'No name provided' });
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error', 'Habit name is required');
    });
  });

  // Happy path: reading all active habits
  describe('GET /api/habits', () => {
    it('should return only active habits, filtering out inactive ones', async () => {
      await Habit.create([
        { name: 'Meditate', description: '10 minutes' },
        { name: 'Read', description: '20 pages', isActive: false },
      ]);

      const res = await request(app).get('/api/habits');

      expect(res.statusCode).toBe(200);
      // Only the active habit should appear — the soft-deleted one must be filtered out
      expect(res.body.length).toBe(1);
      expect(res.body[0].name).toBe('Meditate');
    });
  });

  // Happy path: reading today's habits
  describe('GET /api/habits/today', () => {
    it('should return habits with completedToday: true when a log exists for today', async () => {
      const habit = await Habit.create({ name: 'Hydrate' });

      // Directly insert a HabitLog to simulate the habit being completed today
      await HabitLog.create({ habitId: habit._id, date: today });

      const res = await request(app).get('/api/habits/today');
      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].completedToday).toBe(true);
    });

    it('should return completedToday: false when no log exists for today', async () => {
      // A habit with no associated HabitLog for today
      await Habit.create({ name: 'Journaling' });

      const res = await request(app).get('/api/habits/today');
      expect(res.statusCode).toBe(200);
      expect(res.body[0].completedToday).toBe(false);
    });
  });

  describe('POST /api/habits/:id/log', () => {
    // Happy path: first-time log starts a streak
    it('should create a HabitLog and start a streak of 1 for a brand-new habit', async () => {
      const habit = await Habit.create({ name: 'Floss' });

      const res = await request(app).post(`/api/habits/${habit._id}/log`);
      expect(res.statusCode).toBe(201);
      // The response contains the HabitLog fields merged with the computed streak
      expect(res.body).toHaveProperty('date', today);
      expect(res.body).toHaveProperty('currentStreak', 1);

      // Verify the Habit document was also updated in the database
      const dbHabit = await Habit.findById(habit._id);
      expect(dbHabit.currentStreak).toBe(1);
      expect(dbHabit.lastLoggedDate).toBe(today);
    });

    // Happy path: consecutive day extends the streak
    it('should increment currentStreak to 2 if the habit was logged yesterday', async () => {
      // Seed the habit with an existing streak of 1 and lastLoggedDate of yesterday
      // to simulate a user who logged it the day before and is now logging again today.
      const habit = await Habit.create({
        name: 'Stretch',
        currentStreak: 1,
        lastLoggedDate: yesterday,
      });

      const res = await request(app).post(`/api/habits/${habit._id}/log`);
      expect(res.statusCode).toBe(201);
      expect(res.body.currentStreak).toBe(2);

      // Also verify the longestStreak ceiling was raised by the $max operator in the controller
      const dbHabit = await Habit.findById(habit._id);
      expect(dbHabit.currentStreak).toBe(2);
      expect(dbHabit.longestStreak).toBe(2);
    });

    // Sad path: the compound unique index on HabitLog blocks double-completions
    it('should return 409 Conflict if the habit is already logged today', async () => {
      const habit = await Habit.create({ name: 'No Double Logging' });

      // First log succeeds — we don't assert on this, just use it for setup
      await request(app).post(`/api/habits/${habit._id}/log`);

      // Second log on the same day must be rejected by the database unique index
      const res = await request(app).post(`/api/habits/${habit._id}/log`);
      expect(res.statusCode).toBe(409);
      expect(res.body).toHaveProperty('error', 'Habit already logged for today');
    });

    // Sad path: the habit existence check must happen BEFORE creating the log
    it('should return 404 and not create an orphaned HabitLog for a non-existent habit', async () => {
      const fakeId = '000000000000000000000000';
      const res = await request(app).post(`/api/habits/${fakeId}/log`);
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error', 'Habit not found');

      const orphanedLog = await HabitLog.findOne({ habitId: fakeId });
      expect(orphanedLog).toBeNull();
    });
  });

  describe('DELETE /api/habits/:id', () => {
    // Happy path: delete performs a soft delete, not a hard delete
    it('should set isActive to false and preserve all historical logs', async () => {
      const habit = await Habit.create({ name: 'Old Habit' });
      // Create a log to verify history is preserved after the soft delete
      const log = await HabitLog.create({ habitId: habit._id, date: yesterday });

      const res = await request(app).delete(`/api/habits/${habit._id}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Habit deleted');

      // The Habit document must still exist in the DB — only the flag changes
      const dbHabit = await Habit.findById(habit._id);
      expect(dbHabit.isActive).toBe(false);

      // The associated HabitLog must NOT have been deleted.
      // This ensures historical completion data is preserved for future analytics.
      const dbLog = await HabitLog.findById(log._id);
      expect(dbLog).not.toBeNull();
    });

    // Sad path: deleting a habit that does not exist
    it('should return 404 for a non-existent habit', async () => {
      const fakeId = '000000000000000000000000';
      const res = await request(app).delete(`/api/habits/${fakeId}`);
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error', 'Habit not found');
    });
  });

  describe('DELETE /api/habits/:id/log', () => {
    // Happy path: unlogging removes today's log and rolls back the streak
    it("should remove today's HabitLog and decrement the streak to 0", async () => {
      // Seed the habit as if it was just logged today (currentStreak: 1)
      const habit = await Habit.create({ name: 'Yoga', currentStreak: 1, lastLoggedDate: today });
      await HabitLog.create({ habitId: habit._id, date: today });

      const res = await request(app).delete(`/api/habits/${habit._id}/log`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Log removed');
      expect(res.body.currentStreak).toBe(0);

      // Verify the HabitLog was physically removed from the database
      const dbLog = await HabitLog.findOne({ habitId: habit._id, date: today });
      expect(dbLog).toBeNull();
    });

    // Sad path: unlogging when nothing was logged today
    it('should return 200 gracefully if the habit was not logged today', async () => {
      const habit = await Habit.create({ name: 'Unlogged Habit' });

      const res = await request(app).delete(`/api/habits/${habit._id}/log`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Log removed');
    });

    // Sad path: the habit itself does not exist
    it('should return 404 if the habit does not exist', async () => {
      const fakeId = '000000000000000000000000';
      const res = await request(app).delete(`/api/habits/${fakeId}/log`);
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error', 'Habit not found');
    });
  });

  describe('PUT /api/habits/:id', () => {
    // Happy path: updating name and description
    it('should update and return the habit with the new name and description', async () => {
      const habit = await Habit.create({ name: 'Old Name' });

      const res = await request(app)
        .put(`/api/habits/${habit._id}`)
        .send({ name: 'New Name', description: 'Updated description' });

      expect(res.statusCode).toBe(200);
      // The controller returns the updated document (returnDocument: 'after')
      expect(res.body.name).toBe('New Name');
      expect(res.body.description).toBe('Updated description');
    });

    // Sad path: the habit does not exist
    it('should return 404 for a non-existent habit', async () => {
      const fakeId = '000000000000000000000000';
      const res = await request(app).put(`/api/habits/${fakeId}`).send({ name: 'Anything' });

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error', 'Habit not found');
    });

    // Sad path: name is required — the controller validates before touching the DB
    it('should return 400 if name is empty', async () => {
      const habit = await Habit.create({ name: 'Valid Habit' });
      const res = await request(app).put(`/api/habits/${habit._id}`).send({ name: '' });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error', 'Habit name is required');
    });
  });
});
