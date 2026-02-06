import { useParams, Navigate } from 'react-router-dom'
import ChallengeCard from '../components/ChallengeCard.tsx'
import { useProgress } from '../hooks/useProgress.ts'
import { LANGUAGES, CATEGORIES, CATEGORY_LABELS } from '../types.ts'
import type { Language, Category } from '../types.ts'
import { getChallengesByCategory } from '../data/challenges.ts'

export default function CategoryPage() {
  const { language, category } = useParams()
  const { isCompleted } = useProgress()

  if (!language || !LANGUAGES.includes(language as Language)) {
    return <Navigate to="/" replace />
  }
  if (!category || !CATEGORIES.includes(category as Category)) {
    return <Navigate to={`/${language}`} replace />
  }

  const lang = language as Language
  const cat = category as Category
  const catChallenges = getChallengesByCategory(cat)

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{CATEGORY_LABELS[cat]}</h2>
        <p className="text-gray-600 text-sm mt-1">
          {catChallenges.length} challenge{catChallenges.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="space-y-4">
        {catChallenges.map(challenge => (
          <ChallengeCard
            key={challenge.id}
            challenge={challenge}
            language={lang}
            isCompleted={isCompleted(challenge.id)}
          />
        ))}
      </div>
    </div>
  )
}
