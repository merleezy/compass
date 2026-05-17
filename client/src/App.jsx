import { Routes, Route, Navigate } from 'react-router-dom';
import HabitsPage from './pages/HabitsPage';
import HomePage from './pages/HomePage'
import TasksPage from './pages/TasksPage'
import ReflectionsPage from './pages/ReflectionsPage'
import GoalsPage from './pages/GoalsPage'
import SettingsPage from './pages/SettingsPage'
import AppShell from './components/layout/AppShell';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<HomePage />} />
          <Route path="/habits" element={<HabitsPage />} /> 
          <Route path="/tasks" element={<TasksPage />} /> 
          <Route path="/reflections" element={<ReflectionsPage />} /> 
          <Route path="/goals" element={<GoalsPage />} /> 
          <Route path="/settings" element={<SettingsPage />} /> 
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  );
}

export default App
