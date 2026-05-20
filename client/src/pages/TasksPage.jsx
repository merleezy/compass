import { useState, useRef, useEffect } from 'react';
import TaskList from '../components/features/tasks/TaskList';
import TaskForm from '../components/features/tasks/TaskForm';
import Modal from '../components/ui/Modal';

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const [pendingComplete, setPendingComplete] = useState(new Set());
  // Timeout IDs stored in a ref — updating them shouldn't trigger re-renders
  const timeoutsRef = useRef({});

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/tasks`);
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error('Failed to fetch tasks', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreate = async (title, description, dueDate) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, dueDate }),
      });

      // Check if the request was successful
      if (!res.ok) {
        // Parse the error response sent from backend controller
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create task!');
      }

      // If successful, fetch the updated list of tasks
      fetchTasks();
    } catch (err) {
      console.error('Failed to create task', err);
      alert(err.message);
    }
  };

  const handleToggle = async (_id, isCurrentlyCompleted) => {
    // 1. Optimistic Update & Timer Setup
    if (!isCurrentlyCompleted) {
      // Checking off: Mark completed visually, add to pending so it doesn't move immediately
      setTasks((prev) => prev.map((t) => (t._id === _id ? { ...t, completed: true } : t)));
      setPendingComplete((prev) => new Set([...prev, _id]));

      // Start the 2.5s transition window
      timeoutsRef.current[_id] = setTimeout(() => {
        setPendingComplete((prev) => {
          const next = new Set(prev);
          next.delete(_id);
          return next;
        });
        delete timeoutsRef.current[_id];
      }, 2500);
    } else {
      // Unchecking: Reset immediately, cancel active timer
      clearTimeout(timeoutsRef.current[_id]);
      delete timeoutsRef.current[_id];
      setPendingComplete((prev) => {
        const next = new Set(prev);
        next.delete(_id);
        return next;
      });
      setTasks((prev) => prev.map((t) => (t._id === _id ? { ...t, completed: false } : t)));
    }

    // 2. Perform API Call in background
    try {
      const endpoint = isCurrentlyCompleted ? 'uncomplete' : 'complete';
      const res = await fetch(`${import.meta.env.VITE_API_URL}/tasks/${_id}/${endpoint}`, {
        method: 'PATCH',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.error || `Failed to ${isCurrentlyCompleted ? 'uncomplete' : 'complete'} task!`,
        );
      }

      // Sync state with the final returned data from database
      const data = await res.json();
      setTasks((prev) =>
        prev.map((t) => (t._id === _id ? { ...t, completed: data.completed } : t)),
      );
    } catch (err) {
      console.error('Failed to toggle task:', err);
      alert(err.message);

      // 3. Rollback on Failure
      if (!isCurrentlyCompleted) {
        // Rollback check: cancel timer, remove pending, set completed back to false
        clearTimeout(timeoutsRef.current[_id]);
        delete timeoutsRef.current[_id];
        setPendingComplete((prev) => {
          const next = new Set(prev);
          next.delete(_id);
          return next;
        });
        setTasks((prev) => prev.map((t) => (t._id === _id ? { ...t, completed: false } : t)));
      } else {
        // Rollback uncheck: set completed back to true
        setTasks((prev) => prev.map((t) => (t._id === _id ? { ...t, completed: true } : t)));
      }
    }
  };

  const handleDelete = async (_id) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/tasks/${_id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to delete task!');
      }

      setTasks((prev) => prev.filter((t) => t._id !== _id));
    } catch (err) {
      console.error('Failed to delete task', err);
      alert(err.message);
    }
  };

  const handleEdit = async (_id, title, description, dueDate) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/tasks/${_id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, dueDate }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to edit task!');
      }

      fetchTasks();
    } catch (err) {
      console.error('Failed to edit task', err);
      alert(err.message);
    }
  };

  return (
    <div>
      {/* Page heading */}
      <div className="mb-10">
        <h2 className="text-3xl md:text-4xl font-headline font-extrabold text-text tracking-tight mb-2">
          Tasks
        </h2>
        <p className="text-text-muted font-body italic">Organize your day, master your time.</p>
      </div>

      <div className="space-y-6 lg:space-y-8">
        {isLoading ? (
          <div className="bg-surface rounded-xl p-8 shadow-sm">
            <div className="flex items-center gap-3 text-text-muted">
              <div className="h-5 w-5 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
              <span className="font-body">Loading tasks...</span>
            </div>
          </div>
        ) : (
          <TaskList
            tasks={tasks}
            pendingComplete={pendingComplete}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onEdit={handleEdit}
            showCompleted={showCompleted}
            onToggleCompleted={() => setShowCompleted((s) => !s)}
            onAdd={() => setModalOpen(true)}
          />
        )}
      </div>

      {modalOpen && (
        <Modal onClose={() => setModalOpen(false)}>
          <TaskForm onCreate={handleCreate} onClose={() => setModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
