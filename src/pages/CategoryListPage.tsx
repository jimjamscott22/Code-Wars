import { useParams, Navigate } from 'react-router-dom'
import CategoryCard from '../components/CategoryCard.tsx'
import CompletionBanner from '../components/CompletionBanner.tsx'
import { useProgress } from '../hooks/useProgress.ts'
import { CATEGORIES, LANGUAGES, LANGUAGE_LABELS } from '../types.ts'
import type { Language, Category } from '../types.ts'
import { getChallengesByCategory, challenges } from '../data/challenges.ts'

export default function CategoryListPage() {
  const { language } = useParams()
  const { isCompleted, completedCount } = useProgress()

  if (!language || !LANGUAGES.includes(language as Language)) {
    return <Navigate to="/" replace />
  }

  const lang = language as Language

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {LANGUAGE_LABELS[lang]} Challenges
        </h2>
        <p className="text-gray-600 text-sm mt-1">Choose a category to get started.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORIES.map(cat => {
          const catChallenges = getChallengesByCategory(cat as Category)
          const completedInCat = catChallenges.filter(c => isCompleted(c.id)).length
          return (
            <CategoryCard
              key={cat}
              category={cat as Category}
              language={lang}
              totalChallenges={catChallenges.length}
              completedChallenges={completedInCat}
            />
          )
        })}
      </div>

      {completedCount === challenges.length && <CompletionBanner />}
    </div>
  )
}
