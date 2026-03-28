'use client'

import { useEffect, useState } from 'react'
import { AddTaskForm } from '@/components/add-task-form'
import { TaskItem } from '@/components/task-item'
import { DecorativeStickers } from '@/components/decorative-stickers'

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
    <main className="min-h-screen bg-background overflow-hidden relative">
      <DecorativeStickers />
      
      <div className="max-w-lg mx-auto py-8 px-4 sm:py-16 relative z-10">
        {/* Header with scalloped top */}
        <div className="mb-12 relative">
          {/* Scalloped green header background */}
          <div className="absolute -left-4 -right-4 top-0 -translate-y-8 h-32 bg-secondary rounded-b-3xl shadow-sm">
            <svg className="absolute -bottom-1 left-0 w-full h-8 text-background" viewBox="0 0 400 30" preserveAspectRatio="none">
              <defs>
                <pattern id="scallop" x="0" y="0" width="40" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 0 15 Q 10 0 20 15 Q 30 0 40 15" fill="none" />
                  <path d="M 0 15 Q 10 30 20 15 Q 30 30 40 15" fill="currentColor" />
                </pattern>
              </defs>
              <path d="M 0 0 L 400 0 L 400 15 Q 390 25 380 15 Q 370 25 360 15 Q 350 25 340 15 Q 330 25 320 15 Q 310 25 300 15 Q 290 25 280 15 Q 270 25 260 15 Q 250 25 240 15 Q 230 25 220 15 Q 210 25 200 15 Q 190 25 180 15 Q 170 25 160 15 Q 150 25 140 15 Q 130 25 120 15 Q 110 25 100 15 Q 90 25 80 15 Q 70 25 60 15 Q 50 25 40 15 Q 30 25 20 15 Q 10 25 0 15 Z" fill="currentColor" />
            </svg>
          </div>
          
          <div className="relative pt-12">
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-2 text-balance">
              Our Checklist
            </h1>
            <p className="text-lg text-white/90 font-light italic">
              things we want to do together
            </p>
          </div>
        </div>

        {/* Add Task Form */}
        <div className="mb-10">
          <AddTaskForm onAddTask={handleAddTask} />
        </div>

        {/* Tasks List */}
        <div className="mb-10 space-y-3">
          {sortedActiveTasks.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border-2 border-border">
              <div className="inline-block mb-4 p-4 bg-accent/20 rounded-full">
                <svg className="w-10 h-10 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m0 0h6m0 0h-6m0-6h-6m0 6h6" />
                </svg>
              </div>
              <p className="text-foreground font-semibold text-lg mb-2">No tasks yet</p>
              <p className="text-muted-foreground text-sm font-light">
                Add something fun to get started
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
          <div className="relative">
            {/* Scalloped blue bottom */}
            <div className="absolute -left-4 -right-4 -bottom-8 h-32 bg-secondary rounded-t-3xl shadow-sm">
              <svg className="absolute -top-1 left-0 w-full h-8 text-background" viewBox="0 0 400 30" preserveAspectRatio="none">
                <path d="M 0 30 L 400 30 L 400 15 Q 390 5 380 15 Q 370 5 360 15 Q 350 5 340 15 Q 330 5 320 15 Q 310 5 300 15 Q 290 5 280 15 Q 270 5 260 15 Q 250 5 240 15 Q 230 5 220 15 Q 210 5 200 15 Q 190 5 180 15 Q 170 5 160 15 Q 150 5 140 15 Q 130 5 120 15 Q 110 5 100 15 Q 90 5 80 15 Q 70 5 60 15 Q 50 5 40 15 Q 30 5 20 15 Q 10 5 0 15 Z" fill="currentColor" />
              </svg>
            </div>

            <div className="relative pt-8 pb-16 px-4 -mx-4">
              <details className="group cursor-pointer">
                <summary className="flex items-center gap-3 text-base font-semibold text-white hover:opacity-90 transition-opacity select-none">
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
          </div>
        )}
      </div>
    </main>
  )
}
