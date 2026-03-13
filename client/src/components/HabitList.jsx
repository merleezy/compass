import HabitItem from './HabitItem';

// Receives the habits array and the toggle callback from HabitsPage
export default function HabitList({ habits, onToggle }) {
  if (habits.length === 0) {
    return <p>No habits yet. Add one below.</p>;
  }

  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {habits.map((habit) => (
        <HabitItem
          key={habit._id} 
          habit={habit}
          onToggle={onToggle}
        />
      ))}
    </ul>
  );
}