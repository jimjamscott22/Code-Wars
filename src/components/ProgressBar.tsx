import { Zap } from 'lucide-react'

export default function ProgressBar({ completed, total }: { completed: number; total: number }) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

  return (
    <div className="inline-flex items-center gap-3 rounded-lg border border-amber-100 bg-amber-50/70 px-3 py-2">
      <Zap className="text-amber-500" size={18} />
      <span className="text-slate-600 text-sm">Progress</span>
      <div className="flex items-center gap-2">
        <div className="w-28 h-2 bg-amber-100 rounded-full overflow-hidden" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={completed}>
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="font-semibold text-indigo-600 text-sm">
          {completed}/{total} ({percentage}%)
        </span>
      </div>
    </div>
  )
}
