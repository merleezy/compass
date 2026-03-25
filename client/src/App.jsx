import { Routes, Route, Link } from 'react-router-dom';
import HabitsPage from './pages/HabitsPage';
import HomePage from './pages/HomePage'
import TasksPage from './pages/TasksPage'
import FinancesPage from './pages/FinancesPage'
import GoalsPage from './pages/GoalsPage'
import SettingsPage from './pages/SettingsPage'
import AppShell from './components/layout/AppShell';

function App() {
  return (
    <>
      <nav>
        <Link to='/'>Home</Link> | <Link to='/habits'>Habits</Link>
      </nav>

      <Routes>
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<HomePage />} />
          <Route path="/habits" element={<HabitsPage />} /> 
          <Route path="/tasks" element={<TasksPage />} /> 
          <Route path="/finances" element={<FinancesPage />} /> 
          <Route path="/goals" element={<GoalsPage />} /> 
          <Route path="/settings" element={<SettingsPage />} /> 
        </Route>
      </Routes>
    </>
  );
}

export default App
