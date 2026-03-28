'use client'

import { Trash2 } from 'lucide-react'

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
    <div className="flex items-center gap-3 p-4 bg-card border border-border rounded-lg hover:shadow-md transition-shadow group">
      <input
        type="checkbox"
        checked={completed}
        onChange={() => onToggle(id)}
        className="w-5 h-5 rounded cursor-pointer accent-primary flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium break-words ${
            completed
              ? 'text-muted-foreground line-through'
              : 'text-foreground'
          }`}
        >
          {title}
        </p>
      </div>
      {daysRemaining !== undefined && (
        <div className="flex-shrink-0 px-3 py-1 bg-secondary rounded-full">
          <span className="text-xs font-semibold text-secondary-foreground">
            T-{daysRemaining}
          </span>
        </div>
      )}
      <button
        onClick={() => onDelete(id)}
        className="p-2 text-muted-foreground hover:text-destructive rounded-lg transition-colors opacity-0 group-hover:opacity-100"
        aria-label="Delete task"
      >
        <Trash2 size={16} />
      </button>
    </div>
  )
}
