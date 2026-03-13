import { Routes, Route, Link } from 'react-router-dom';
import HabitsPage from './pages/HabitsPage';

function HomePage() {
  return (
    <div>
      <h1>Compass</h1>
      <p>Your personal dashboard is coming soon...</p>
    </div>
  )
}

function App() {
  return (
    <>
      <nav>
        <Link to='/'>Home</Link> | <Link to='/habits'>Habits</Link>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/habits" element={<HabitsPage />} />
      </Routes>
    </>
  );
}

export default App
