import { useState, useEffect } from 'react';
import ProgressCard from '../components/ui/ProgressCard'
import HabitList from '../components/features/habits/HabitList'
import HabitForm from '../components/features/habits/HabitForm'

export default function HabitsPage() {
  const [habits, setHabits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Detect the browser's local IANA timezone once (e.g. "America/Chicago").
  // This is passed to every API call so the server uses the correct local date
  // instead of UTC, which would cause habits to "reset" at 7 PM CDT.
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const fetchHabits = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/habits/today?tz=${encodeURIComponent(tz)}`);
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
    // Optimistically flip the checkbox
    setHabits((prev) =>
      prev.map((h) => h._id === habitId ? { ...h, completedToday: !isCurrentlyCompleted } : h)
    );

    try {
      const res = isCurrentlyCompleted
        ? await fetch(`${import.meta.env.VITE_API_URL}/habits/${habitId}/log?tz=${encodeURIComponent(tz)}`, { method: 'DELETE' })
        : await fetch(`${import.meta.env.VITE_API_URL}/habits/${habitId}/log?tz=${encodeURIComponent(tz)}`, { method: 'POST' });

      const data = await res.json();

      // Both log and unlog now return currentStreak — patch it into state
      // so the badge updates live without a full refetch
      if (typeof data.currentStreak === 'number') {
        setHabits((prev) =>
          prev.map((h) => h._id === habitId ? { ...h, currentStreak: data.currentStreak } : h)
        );
      }
    } catch (err) {
      console.error("Failed to toggle habits", err);

      // Roll back the optimistic update if the API call failed
      setHabits((prev) =>
        prev.map((h) => h._id === habitId ? { ...h, completedToday: isCurrentlyCompleted } : h)
      );
    }
  };

  const handleCreate = async (name, description) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/habits`, {
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
      await fetch(`${import.meta.env.VITE_API_URL}/habits/${habitId}`, {
        method: "DELETE",
      });
      setHabits((prev) => prev.filter((h) => h._id !== habitId));
    } catch (err) {
      console.error("Failed to delete habit", err);
    }
  }

  const handleEdit = async (habitId, name, description) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/habits/${habitId}`, {
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
        <h2 className='text-3xl md:text-4xl font-headline font-extrabold text-text tracking-tight mb-2'>
          Habits
        </h2>
        <p className='text-text-muted font-body italic'>
          Small actions, compounding results.
        </p>
      </div>

      {/* Two column grid — stacks on mobile, side-by-side on lg+ */}
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8'>
        {/* Left column */}
        <div className='lg:col-span-8 space-y-6 lg:space-y-8'>
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
        <div className="lg:col-span-4 space-y-6 lg:space-y-8">
          <HabitForm onCreate={handleCreate} />
        </div>

      </div>
    </div>
  );
}
