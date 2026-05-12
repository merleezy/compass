import { useState, useEffect } from 'react';
import ProgressCard from '../components/ui/ProgressCard'
import HabitList from '../components/features/habits/HabitList'
import HabitForm from '../components/features/habits/HabitForm'

export default function HabitsPage() {
  const [habits, setHabits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHabits = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/habits/today');
      const data = await res.json()
      setHabits(data);
    } catch (err) {
      console.error("Failed to fetch habits", err)
    } finally {
      setIsLoading(false);
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

  const handleDelete = async (habitId) => {
    try {
      await fetch(`/api/habits/${habitId}`, {
        method: "DELETE",
      });
      setHabits((prev) => prev.filter((h) => h._id !== habitId));
    } catch (err) {
      console.error("Failed to delete habit", err);
    }
  }

  const handleEdit = async (habitId, name, description) => {
    try {
      await fetch(`/api/habits/${habitId}`, {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }),
      });
      fetchHabits();
    } catch (err) {
      console.error("Failed to edit habit", err);
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
          Small actions, compounding results.
        </p>
      </div>

      {/* Two column grid */}
      <div className='grid grid-cols-12 gap-8'>
        {/* Left column */}
        <div className='col-span-8 space-y-8'>
          <ProgressCard completed={completedCount} total={totalCount} title="Daily Habits Progress"/>

          {isLoading ? (
            <div className="bg-surface rounded-xl p-8 shadow-sm">
              <div className="flex items-center gap-3 text-text-muted">
                <div className="h-5 w-5 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
                <span className="font-body">Loading habits...</span>
              </div>
            </div>
          ) : (
            <HabitList habits={habits} onToggle={handleToggle} onDelete={handleDelete} onEdit={handleEdit}/>
          )}
        </div>


        {/* Right column */}
        <div className="col-span-4 space-y-8">
          <HabitForm onCreate={handleCreate} />
        </div>

      </div>
    </div>
  );
}
