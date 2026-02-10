import { Link } from 'react-router-dom'
import { CheckCircle, Circle } from 'lucide-react'
import type { Challenge, Language } from '../types.ts'
import DifficultyBadge from './DifficultyBadge.tsx'

interface ChallengeCardProps {
  challenge: Challenge
  language: Language
  isCompleted: boolean
}

export default function ChallengeCard({ challenge, language, isCompleted }: ChallengeCardProps) {
  return (
    <Link
      to={`/${language}/${challenge.category}/${challenge.id}`}
      className={`group block rounded-2xl border border-slate-200 bg-white p-6 hover:-translate-y-0.5 hover:shadow-lg transition-all ${isCompleted ? 'ring-2 ring-emerald-500 border-emerald-200' : ''}`}
    >
      <div className="flex items-center gap-3">
        {isCompleted ? (
          <CheckCircle className="text-emerald-500 shrink-0" size={24} />
        ) : (
          <Circle className="text-slate-400 shrink-0 group-hover:text-indigo-500 transition-colors" size={24} />
        )}
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{challenge.title}</h3>
          <DifficultyBadge difficulty={challenge.difficulty} />
        </div>
      </div>
      <p className="text-slate-600 mt-3 text-sm line-clamp-2">{challenge.description}</p>
    </Link>
  )
}
