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
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 py-8 px-4 sm:py-16">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-block mb-4 px-4 py-2 bg-secondary/30 rounded-full">
            <span className="text-xs font-semibold tracking-wide text-secondary-foreground uppercase">
              Shared List
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-light text-foreground mb-3 text-balance tracking-tight">
            Our Checklist
          </h1>
          <p className="text-base text-muted-foreground font-light">
            Things we want to do together
          </p>
        </div>

        {/* Add Task Form */}
        <div className="mb-10">
          <AddTaskForm onAddTask={handleAddTask} />
        </div>

        {/* Tasks List */}
        <div className="space-y-3">
          {sortedActiveTasks.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-block mb-4 p-4 bg-secondary/20 rounded-full">
                <svg className="w-8 h-8 text-secondary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m0 0h6m0 0h-6m0-6h-6m0 6h6" />
                </svg>
              </div>
              <p className="text-foreground font-light text-lg mb-2">No tasks yet</p>
              <p className="text-muted-foreground text-sm font-light">
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
          <div className="mt-12 pt-8 border-t border-border">
            <details className="group cursor-pointer">
              <summary className="flex items-center gap-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors select-none">
                <span className="inline-flex items-center justify-center w-5 h-5 group-open:rotate-90 transition-transform">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
                Completed ({completedTasks.length})
              </summary>
              <div className="mt-4 space-y-3">
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
