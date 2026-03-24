import { useState, useEffect } from 'react';
import ProgressCard from '../components/habits/ProgressCard'
import HabitList from '../components/habits/HabitList'
import HabitForm from '../components/habits/HabitForm'

export default function HabitsPage() {
  const [habits, setHabits] = useState([]);

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
      prev.map((h) => h._id === habitId ? { ...h, completedToday: !isCurrentlyCompleted } : h)
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
        prev.map((h) => h._id === habitId ? { ...h, completedToday: isCurrentlyCompleted } : h)
      );
    }
  };

  const handleCreate = async (name, description) => {
    try {
      await fetch('/api/habits', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }),
      });
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
      {/* Page heading */}
      <div className='mb-10'>
        <h2 className='text-4xl font-headline font-extrabold text-text tracking-tight mb-2'>
          Habits
        </h2>
        <p className='text-text-muted font-body italic'>
          Cultivate your routine, curate your life.
        </p>
      </div>

      {/* Two column grid */}
      <div className='grid grid-cols-12 gap-8'>
        {/* Left column */}
        <div className='col-span-8 space-y-8'>
          <ProgressCard completed={completedCount} total={totalCount}/>
          <HabitList habits={habits} onToggle={handleToggle} />
        </div>

        {/* Right column */}
        <div className="col-span-4 space-y-8">
          <HabitForm onCreate={handleCreate} />
        </div>

      </div>
    </div>
  );
}
