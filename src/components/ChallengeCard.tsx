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
      className={`block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow ${isCompleted ? 'ring-2 ring-green-500' : ''}`}
    >
      <div className="flex items-center gap-3">
        {isCompleted ? (
          <CheckCircle className="text-green-500 shrink-0" size={24} />
        ) : (
          <Circle className="text-gray-400 shrink-0" size={24} />
        )}
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{challenge.title}</h3>
          <DifficultyBadge difficulty={challenge.difficulty} />
        </div>
      </div>
      <p className="text-gray-600 mt-3 text-sm line-clamp-2">{challenge.description}</p>
    </Link>
  )
}
