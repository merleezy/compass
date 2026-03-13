import { useState, useEffect } from 'react';
import HabitList from '../components/HabitList'

export default function HabitsPage() {
  const [habits, setHabits] = useState([]);

  const [newName, setNewName] = useState('')
  const [newDescription, setNewDescription] = useState('')

  const fetchHabits = async () => {
    try {
      const res = await fetch('/api/habits/today');
      const data = await res.json()
      setHabits(data);
    } catch (err) {
      console.error("Failed to fetch habits", err)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      await fetchHabits();
    };
    fetchData();
  }, []);

  const handleToggle = async (habitId, isCurrentlyCompleted) => {
    // Immediately flip the checkbox in local state
    setHabits((prev) =>
      prev.map((h) =>
        h._id === habitId
          ? { ...h, completedToday: !isCurrentlyCompleted }
          : h
      )
    );

    try {
      if (isCurrentlyCompleted) {
        await fetch(`/api/habits/${habitId}/log`, { method: 'DELETE' });
      } else {
        await fetch(`/api/habits/${habitId}/log`, { method: "POST"});
      }
    } catch (err) {
      console.error("Failed to toggle habits", err)

      // If the API call failed, roll back the optimistic update
      // so the UI reflects reality again
      setHabits((prev) =>
        prev.map((h) =>
          h._id === habitId
            ? { ...h, completedToday: isCurrentlyCompleted }
            : h
        )
      );
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!newName.trim()) return;

    try {
      await fetch('/api/habits', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName, description: newDescription }),
      });

      // Clear the form inputs
      setNewName('')
      setNewDescription('')

      // Re-fetch to show the new habit
      fetchHabits();
    } catch (err) {
      console.error("Failed to create new habit", err);
    }
  }

  const completedCount = habits.filter((h) => h.completedToday).length;
  const totalCount = habits.length;

  return (
    <div>
      <h1>Habits</h1>

      {/* Progress Bar */}
      {totalCount > 0 && (
        <div>
          <p>{completedCount} / {totalCount} completed today</p>
          <div style={{ background: '#eee', borderRadius: 4, height: 12 }}>
            <div
              style={{
                width: `${(completedCount / totalCount) * 100}%`,
                background: '#4caf50',
                height: '100%',
                borderRadius: 4,
                transition: 'width 0.3s ease', // smooth animation when progress changes
              }}
            />
          </div>
        </div>
      )}

      {/* Habit list */}
      <HabitList habits={habits} onToggle={handleToggle} />

      {/* New habit form */}
      <h2>Add a Habit</h2>
      <form onSubmit={handleCreate}>
        <div>
          <input 
            type="text" 
            placeholder="Habit name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        </div>
        <div>
          <input 
          type="text" 
          placeholder="Description (optional)"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          />
        </div>
        <button type="submit">Add Habit</button>
      </form>
    </div>
  );
}
