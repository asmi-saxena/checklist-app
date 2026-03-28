'use client'

import { useEffect, useState } from 'react'
import { AddTaskForm } from '@/components/add-task-form'
import { TaskItem } from '@/components/task-item'

interface Task {
  id: string
  title: string
  completed: boolean
  date?: string
}

const STORAGE_KEY = 'checklist-tasks'

function calculateDaysRemaining(dateString: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const targetDate = new Date(dateString)
  targetDate.setHours(0, 0, 0, 0)

  const diffTime = targetDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return diffDays
}

export default function ChecklistPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load tasks from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setTasks(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to load tasks:', e)
      }
    }
    setIsLoading(false)
  }, [])

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    }
  }, [tasks, isLoading])

  const handleAddTask = (newTask: { title: string; date?: string }) => {
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      completed: false,
      date: newTask.date,
    }
    setTasks([...tasks, task])
  }

  const handleToggleTask = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    )
  }

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  // Split tasks into active and completed
  const activeTasks = tasks.filter((task) => !task.completed)
  const completedTasks = tasks.filter((task) => task.completed)

  // Sort active tasks by date
  const sortedActiveTasks = [...activeTasks].sort((a, b) => {
    if (!a.date && !b.date) return 0
    if (!a.date) return 1
    if (!b.date) return -1
    return new Date(a.date).getTime() - new Date(b.date).getTime()
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background py-6 px-4 sm:py-10">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2 text-balance">
            Our Checklist
          </h1>
          <p className="text-sm text-muted-foreground">
            Things to do together
          </p>
        </div>

        {/* Add Task Form */}
        <div className="mb-8">
          <AddTaskForm onAddTask={handleAddTask} />
        </div>

        {/* Tasks List */}
        <div className="space-y-3">
          {sortedActiveTasks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-2">No tasks yet!</p>
              <p className="text-xs text-muted-foreground">
                Add something to get started
              </p>
            </div>
          ) : (
            sortedActiveTasks.map((task) => (
              <TaskItem
                key={task.id}
                id={task.id}
                title={task.title}
                completed={task.completed}
                daysRemaining={
                  task.date ? calculateDaysRemaining(task.date) : undefined
                }
                onToggle={handleToggleTask}
                onDelete={handleDeleteTask}
              />
            ))
          )}
        </div>

        {/* Completed Tasks Section */}
        {completedTasks.length > 0 && (
          <div className="mt-8 pt-6 border-t border-border">
            <details className="group cursor-pointer">
              <summary className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                <span className="text-lg">▶</span>
                Completed ({completedTasks.length})
              </summary>
              <div className="mt-4 space-y-2">
                {completedTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    id={task.id}
                    title={task.title}
                    completed={task.completed}
                    onToggle={handleToggleTask}
                    onDelete={handleDeleteTask}
                  />
                ))}
              </div>
            </details>
          </div>
        )}
      </div>
    </main>
  )
}
