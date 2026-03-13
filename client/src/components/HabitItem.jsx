// Represents a single habit row with a checkbox
export default function HabitItem({ habit, onToggle }) {
  return (
    <li style={{ marginBottom: 12 }}>
      <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
        <input
          type="checkbox"
          checked={habit.completedToday}
          onChange={() => onToggle(habit._id, habit.completedToday)}
          // onChange fires every time the checkbox is clicked
          // we pass the current state up so HabitsPage decides what API call to make
        />
        <span>
          <strong>{habit.name}</strong>
          {habit.description && (
            // only render the description if it exists
            <span style={{ marginLeft: 8, color: '#666' }}>{habit.description}</span>
          )}
        </span>
      </label>
    </li>
  );
}