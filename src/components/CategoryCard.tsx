import { Link } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'
import type { Category, Language } from '../types.ts'
import { CATEGORY_LABELS } from '../types.ts'

interface CategoryCardProps {
  category: Category
  language: Language
  totalChallenges: number
  completedChallenges: number
}

export default function CategoryCard({ category, language, totalChallenges, completedChallenges }: CategoryCardProps) {
  const allDone = completedChallenges === totalChallenges && totalChallenges > 0
  const completionPct = totalChallenges > 0 ? (completedChallenges / totalChallenges) * 100 : 0

  return (
    <Link
      to={`/${language}/${category}`}
      className={`block rounded-2xl border border-slate-200 bg-white p-6 hover:-translate-y-0.5 hover:shadow-lg transition-all ${allDone ? 'ring-2 ring-emerald-500 border-emerald-200' : ''}`}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-semibold text-slate-900">{CATEGORY_LABELS[category]}</h3>
        {allDone && <CheckCircle className="text-emerald-500" size={24} />}
      </div>
      <p className="text-slate-500 text-sm">
        {totalChallenges} challenge{totalChallenges !== 1 ? 's' : ''}
      </p>
      <div className="mt-3 flex items-center gap-2">
        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full transition-all duration-300"
            style={{ width: `${completionPct}%` }}
          />
        </div>
        <span className="text-xs text-slate-500">
          {completedChallenges}/{totalChallenges}
        </span>
      </div>
    </Link>
  )
}
