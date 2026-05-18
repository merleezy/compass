import { useState, useRef } from 'react'
import TaskList from '../components/features/tasks/TaskList'
import TaskForm from '../components/features/tasks/TaskForm'
import Modal from '../components/ui/Modal'

function getRelativeDate(offsetDays) {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  return new Intl.DateTimeFormat('en-CA').format(d)
}

const INITIAL_TASKS = [
  { _id: '1', title: 'Finish project proposal', description: 'Slides + summary doc', dueDate: getRelativeDate(-2), completed: false },
  { _id: '2', title: 'Review pull requests',    description: '',                       dueDate: getRelativeDate(0),  completed: false },
  { _id: '3', title: 'Write daily standup',      description: '',                       dueDate: getRelativeDate(0),  completed: false },
  { _id: '4', title: 'Plan weekend trip',         description: '',                       dueDate: getRelativeDate(3),  completed: false },
  { _id: '5', title: 'Read SICP chapter 3',       description: '',                       dueDate: null,                completed: false },
  { _id: '6', title: 'Buy groceries',             description: '',                       dueDate: null,                completed: true  },
]

let nextId = 7

export default function TasksPage() {
  const [tasks, setTasks]                 = useState(INITIAL_TASKS)
  const [modalOpen, setModalOpen]         = useState(false)
  const [showCompleted, setShowCompleted] = useState(false)
  const [pendingComplete, setPendingComplete] = useState(new Set())
  // Timeout IDs stored in a ref — updating them shouldn't trigger re-renders
  const timeoutsRef = useRef({})

  const handleCreate = (title, description, dueDate) => {
    setTasks(prev => [
      { _id: String(nextId++), title, description, dueDate, completed: false },
      ...prev,
    ])
  }

  const handleToggle = (_id, isCurrentlyCompleted) => {
    if (!isCurrentlyCompleted) {
      // Mark complete visually but keep it in its current group until the delay expires
      setTasks(prev => prev.map(t => t._id === _id ? { ...t, completed: true } : t))
      setPendingComplete(prev => new Set([...prev, _id]))

      timeoutsRef.current[_id] = setTimeout(() => {
        setPendingComplete(prev => {
          const next = new Set(prev)
          next.delete(_id)
          return next
        })
        delete timeoutsRef.current[_id]
      }, 2500)
    } else {
      // Unchecking — always immediate, cancel any running delay
      clearTimeout(timeoutsRef.current[_id])
      delete timeoutsRef.current[_id]
      setPendingComplete(prev => { const next = new Set(prev); next.delete(_id); return next })
      setTasks(prev => prev.map(t => t._id === _id ? { ...t, completed: false } : t))
    }
  }

  const handleDelete = (_id) => {
    // Cancel pending timeout so it doesn't fire after the task is gone
    clearTimeout(timeoutsRef.current[_id])
    delete timeoutsRef.current[_id]
    setPendingComplete(prev => { const next = new Set(prev); next.delete(_id); return next })
    setTasks(prev => prev.filter(t => t._id !== _id))
  }

  const handleEdit = (_id, title, description, dueDate) => {
    setTasks(prev =>
      prev.map(t => t._id === _id ? { ...t, title, description, dueDate } : t)
    )
  }

  return (
    <div>
      {/* Page heading */}
      <div className="mb-10">
        <h2 className="text-3xl md:text-4xl font-headline font-extrabold text-text tracking-tight mb-2">
          Tasks
        </h2>
        <p className="text-text-muted font-body italic">
          Organize your day, master your time.
        </p>
      </div>

      <TaskList
        tasks={tasks}
        pendingComplete={pendingComplete}
        onToggle={handleToggle}
        onDelete={handleDelete}
        onEdit={handleEdit}
        showCompleted={showCompleted}
        onToggleCompleted={() => setShowCompleted(s => !s)}
        onAdd={() => setModalOpen(true)}
      />

      {modalOpen && (
        <Modal onClose={() => setModalOpen(false)}>
          <TaskForm
            onCreate={handleCreate}
            onClose={() => setModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  )
}
