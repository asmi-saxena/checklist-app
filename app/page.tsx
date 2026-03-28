'use client'

import { useEffect, useMemo, useState } from 'react'
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

function encodeTasks(tasks: Task[]): string {
  try {
    return encodeURIComponent(btoa(JSON.stringify(tasks)))
  } catch {
    return ''
  }
}

function decodeTasks(value: string): Task[] {
  try {
    const decoded = atob(decodeURIComponent(value))
    const parsed = JSON.parse(decoded)
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter((item) => item && typeof item === 'object' && 'id' in item)
      .map((item) => ({
        id: String((item as any).id),
        title: String((item as any).title ?? ''),
        completed: Boolean((item as any).completed),
        date: (item as any).date ? String((item as any).date) : undefined,
      }))
  } catch {
    return []
  }
}

function mergeTaskLists(a: Task[], b: Task[]): Task[] {
  const map = new Map<string, Task>()
  ;[...a, ...b].forEach((task) => map.set(task.id, task))
  return Array.from(map.values())
}

export default function ChecklistPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [listId, setListId] = useState<string | null>(null)
  const [isFormExpanded, setIsFormExpanded] = useState(false)
  const [error, setError] = useState<string | null>(null)


  // Load tasks from Supabase (with listId) or localStorage on mount
  useEffect(() => {
    async function init() {
      if (typeof window === 'undefined') return

      const params = new URLSearchParams(window.location.search)
      const paramListId = params.get('listId')
      setListId(paramListId)

      if (paramListId) {
        try {
          const response = await fetch(`/api/tasks?listId=${encodeURIComponent(paramListId)}`)
          const data = await response.json()
          if (response.ok) {
            setTasks(data.tasks || [])
          } else {
            setError(data.error || 'Failed to load shared list')
          }
        } catch (err) {
          setError('Network error while loading shared list')
        }
      } else {
        const stored = window.localStorage.getItem(STORAGE_KEY)
        if (stored) {
          try {
            setTasks(JSON.parse(stored))
          } catch (e) {
            console.error('Failed to load tasks:', e)
            setTasks([])
          }
        }
      }

      setIsLoading(false)
    }

    init()
  }, [])

  // Save tasks to localStorage and optionally to Supabase when listId is set
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    }

    if (!isLoading && listId) {
      ;(async () => {
        try {
          await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ listId, tasks }),
          })
        } catch (err) {
          console.error('Failed to sync to backend', err)
          setError('Could not sync to shared list (network issue).')
        }
      })()
    }
  }, [tasks, listId, isLoading])

  const handleAddTask = (newTask: { title: string; date?: string }) => {
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      completed: false,
      date: newTask.date,
    }
    setTasks([...tasks, task])
    setIsFormExpanded(false)
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
      <div className="min-h-screen bg-[#fdf4e8] flex items-center justify-center">
        <div className="animate-pulse text-[#c06587] font-semibold">Loading...</div>
      </div>
    )
  }

  return (
    <main className="min-h-screen relative overflow-x-hidden bg-[#fdf4e8] text-[#2d4f3d]">
      <div className="absolute inset-0 bg-[#fdf4e8]" />
      <div className="absolute inset-x-0 top-0 h-56 bg-[#62b864]">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full">
          <path d="M0,120 C150,0 350,0 500,120 C650,240 850,240 1000,120 C1150,0 1200,0 1200,120 L1200,0 L0,0 Z" fill="#62b864" />
        </svg>
      </div>

      <DecorativeStickers />

      <div className="absolute left-4 top-4 z-20 rounded-2xl border border-[#f7d8e9] bg-white/90 p-3 shadow-lg backdrop-blur-sm animate-float-slow">
        <p className="text-xs font-black tracking-wider text-[#e7448b]">Asmi&Deep todo</p>
        
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-12 pt-24 lg:px-8">
        <div className="text-center mb-12 animate-bounce-slow">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white drop-shadow-lg">check<span className="text-[#ff9ac2] italic">list</span></h1>
          <p className="mt-2 text-base text-white/80 font-semibold"> things we need to be together </p>
        </div>

        <div className="mx-auto rounded-[2rem] border-4 border-[#fde0d7] bg-white/95 p-5 shadow-[0_15px_30px_rgba(31,56,49,0.15)] sm:p-8">
          <div className={`grid gap-6 lg:gap-8 ${isFormExpanded ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
            <div className={isFormExpanded ? 'lg:col-span-2' : 'lg:col-span-1'}>
              <div>
                {!isFormExpanded ? (
                  <button
                    onClick={() => setIsFormExpanded(true)}
                    className="w-full rounded-3xl border-2 border-[#f8d4db] bg-[#f8d4db] p-4 text-center font-bold text-[#c32772] hover:bg-[#f5b3c8] transition-all animate-scale-in"
                  >
                    + Add Task
                  </button>
                ) : (
                  <div className="rounded-3xl border-2 border-[#f8d4db] bg-white p-6 shadow-sm hover:shadow-md transition-shadow animate-scale-in">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-bold text-[#c32772]">Add New</h2>
                      <button
                        onClick={() => setIsFormExpanded(false)}
                        className="text-[#c32772] text-xl font-bold hover:text-[#a01850]"
                      >
                        ×
                      </button>
                    </div>
                    <AddTaskForm onAddTask={handleAddTask} />
                  </div>
                )}
              </div>
            </div>

            <div className={`space-y-6 animate-slide-in ${isFormExpanded ? 'lg:col-span-2' : 'lg:col-span-2'}`}>
              <div className="rounded-3xl border-2 border-[#f0eae5] bg-white p-5 shadow-sm hover:shadow-lg transition-all duration-300">
                <h2 className="text-lg font-bold text-[#c32772] mb-4 flex items-center gap-2">
                  <span className="inline-block animate-spin-slow">✓</span>
                  To Do
                </h2>
                <div className="space-y-3">
                  {sortedActiveTasks.length === 0 ? (
                    <div className="rounded-2xl border-2 border-dashed border-[#fbbcd8] bg-[#fff1f8] p-10 text-center">
                      <p className="text-lg font-semibold text-[#c3508c]">No tasks yet</p>
                      <p className="text-sm text-[#7f3f66]">Add something playful and share the link to collaborate.</p>
                    </div>
                  ) : (
                    sortedActiveTasks.map((task) => (
                      <TaskItem
                        key={task.id}
                        id={task.id}
                        title={task.title}
                        completed={task.completed}
                        daysRemaining={task.date ? calculateDaysRemaining(task.date) : undefined}
                        onToggle={handleToggleTask}
                        onDelete={handleDeleteTask}
                      />
                    ))
                  )}
                </div>
              </div>

              {completedTasks.length > 0 && (
                <div className="rounded-3xl border-2 border-[#f0eae5] bg-white p-5 shadow-sm hover:shadow-lg transition-all duration-300">
                  <details className="group">
                    <summary className="cursor-pointer rounded-xl bg-[#ffe5f0] px-4 py-2 font-semibold text-[#7d1e61] hover:bg-[#ffd2e7] transition-colors flex items-center justify-between group-open:bg-[#ffd2e7]">
                      <span>Completed ({completedTasks.length})</span>
                      <span className="inline-block transition-transform group-open:rotate-180">▼</span>
                    </summary>
                    <div className="mt-3 space-y-2">
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
          </div>
        </div>
      </div>
    </main>
  )
}

