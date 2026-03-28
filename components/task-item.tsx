'use client'

import { X } from 'lucide-react'

interface TaskItemProps {
  id: string
  title: string
  completed: boolean
  date?: string
  daysRemaining?: number
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export function TaskItem({
  id,
  title,
  completed,
  daysRemaining,
  onToggle,
  onDelete,
}: TaskItemProps) {
  return (
    <div className="group flex items-start gap-4 p-5 bg-white rounded-2xl border-2 border-border shadow-sm transition-all duration-300 hover:shadow-md hover:border-accent/30">
      <input
        type="checkbox"
        checked={completed}
        onChange={() => onToggle(id)}
        className="mt-1 w-6 h-6 rounded-full cursor-pointer accent-primary flex-shrink-0 transition-transform"
      />
      <div className="flex-1 min-w-0 pt-0.5">
        <p
          className={`text-base font-medium leading-relaxed break-words transition-all ${
            completed
              ? 'text-muted-foreground line-through'
              : 'text-foreground'
          }`}
        >
          {title}
        </p>
      </div>
      {daysRemaining !== undefined && (
        <div className="flex-shrink-0 px-3 py-1.5 bg-accent rounded-full shadow-sm">
          <span className="text-xs font-bold text-accent-foreground">
            T-{daysRemaining}
          </span>
        </div>
      )}
      <button
        onClick={() => onDelete(id)}
        className="mt-1 p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
        aria-label="Delete task"
      >
        <X size={18} />
      </button>
    </div>
  )
}
