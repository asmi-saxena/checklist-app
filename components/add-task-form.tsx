'use client'

import { useState } from 'react'
import { Plus, Calendar } from 'lucide-react'

interface AddTaskFormProps {
  onAddTask: (task: { title: string; date?: string }) => void
}

export function AddTaskForm({ onAddTask }: AddTaskFormProps) {
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      onAddTask({
        title: title.trim(),
        date: date || undefined,
      })
      setTitle('')
      setDate('')
      setIsExpanded(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="space-y-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onFocus={() => setIsExpanded(true)}
          placeholder="What would you like to do?"
          className="w-full px-5 py-4 bg-card border border-border rounded-xl text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
        />
        
        {isExpanded && (
          <div className="flex flex-col sm:flex-row gap-3 animate-in fade-in duration-200">
            <div className="flex-1 relative">
              <Calendar className="absolute left-4 top-4 text-muted-foreground" size={18} />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={!title.trim()}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Plus size={20} />
              <span>Add</span>
            </button>
          </div>
        )}
      </div>
    </form>
  )
}
