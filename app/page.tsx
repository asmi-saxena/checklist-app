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
    <main className="min-h-screen bg-background overflow-x-hidden relative">
      <DecorativeStickers />
      
      <div className="max-w-6xl mx-auto py-6 px-4 sm:py-8 lg:py-12 lg:px-8 relative z-10">
        {/* Header with scalloped top */}
        <div className="mb-8 lg:mb-12 relative">
          {/* Scalloped pink header background */}
          <div className="absolute -left-8 -right-8 top-0 -translate-y-6 h-40 lg:h-48 bg-primary rounded-b-3xl lg:rounded-b-4xl shadow-md">
            <svg className="absolute -bottom-1 left-0 w-full h-8 lg:h-10 text-background" viewBox="0 0 400 30" preserveAspectRatio="none">
              <path d="M 0 0 L 400 0 L 400 15 Q 390 25 380 15 Q 370 25 360 15 Q 350 25 340 15 Q 330 25 320 15 Q 310 25 300 15 Q 290 25 280 15 Q 270 25 260 15 Q 250 25 240 15 Q 230 25 220 15 Q 210 25 200 15 Q 190 25 180 15 Q 170 25 160 15 Q 150 25 140 15 Q 130 25 120 15 Q 110 25 100 15 Q 90 25 80 15 Q 70 25 60 15 Q 50 25 40 15 Q 30 25 20 15 Q 10 25 0 15 Z" fill="currentColor" />
            </svg>
          </div>
          
          <div className="relative pt-16 lg:pt-20 text-center lg:text-left">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-3 lg:mb-4 text-balance">
              Our Checklist
            </h1>
            <p className="text-lg lg:text-xl text-white/90 font-light italic">
              things we want to do together
            </p>
          </div>
        </div>

        {/* Main content grid */}
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left sidebar - Form (sticky on desktop) */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-8">
              {/* Add Task Form */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Add New</h2>
                <AddTaskForm onAddTask={handleAddTask} />
              </div>
            </div>
          </div>

          {/* Right content - Tasks */}
          <div className="lg:col-span-2">
            {/* Tasks List */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-foreground mb-4">To Do</h2>
              <div className="space-y-3">
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
            </div>

            {/* Completed Tasks Section */}
            {completedTasks.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-4">Completed</h2>
                <div className="rounded-3xl bg-white border-2 border-border overflow-hidden">
                  <details className="group cursor-pointer">
                    <summary className="flex items-center gap-3 text-base font-semibold text-foreground hover:bg-muted transition-colors select-none p-6">
                      <span className="inline-flex items-center justify-center w-5 h-5 group-open:rotate-90 transition-transform">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                      Done ({completedTasks.length})
                    </summary>
                    <div className="border-t border-border p-6 space-y-3">
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
        </div>
      </div>
    </main>
  )
}
