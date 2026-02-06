import { Zap } from 'lucide-react'

export default function ProgressBar({ completed, total }: { completed: number; total: number }) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

  return (
    <div className="flex items-center gap-3">
      <Zap className="text-yellow-500" size={20} />
      <span className="text-gray-600 text-sm">Progress:</span>
      <div className="flex items-center gap-2">
        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="font-semibold text-blue-600 text-sm">
          {completed}/{total}
        </span>
      </div>
    </div>
  )
}
