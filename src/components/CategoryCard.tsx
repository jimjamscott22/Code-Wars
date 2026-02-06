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

  return (
    <Link
      to={`/${language}/${category}`}
      className={`block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow ${allDone ? 'ring-2 ring-green-500' : ''}`}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-semibold text-gray-800">{CATEGORY_LABELS[category]}</h3>
        {allDone && <CheckCircle className="text-green-500" size={24} />}
      </div>
      <p className="text-gray-500 text-sm">
        {totalChallenges} challenge{totalChallenges !== 1 ? 's' : ''}
      </p>
      <div className="mt-3 flex items-center gap-2">
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${totalChallenges > 0 ? (completedChallenges / totalChallenges) * 100 : 0}%` }}
          />
        </div>
        <span className="text-xs text-gray-500">
          {completedChallenges}/{totalChallenges}
        </span>
      </div>
    </Link>
  )
}
