import { useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import ChallengeCard from '../components/ChallengeCard.tsx'
import { useProgress } from '../hooks/useProgress.ts'
import { LANGUAGES, CATEGORIES, CATEGORY_LABELS } from '../types.ts'
import type { Language, Category } from '../types.ts'
import { getChallengesByCategory } from '../data/challenges.ts'

export default function CategoryPage() {
  const { language, category } = useParams()
  const { isCompleted } = useProgress()
  const [query, setQuery] = useState('')
  const [difficultyFilter, setDifficultyFilter] = useState<'All' | 'Beginner' | 'Intermediate' | 'Advanced'>('All')

  if (!language || !LANGUAGES.includes(language as Language)) {
    return <Navigate to="/" replace />
  }
  if (!category || !CATEGORIES.includes(category as Category)) {
    return <Navigate to={`/${language}`} replace />
  }

  const lang = language as Language
  const cat = category as Category
  const catChallenges = getChallengesByCategory(cat)
  const filteredChallenges = catChallenges.filter((challenge) => {
    const queryMatch =
      query.trim().length === 0 ||
      challenge.title.toLowerCase().includes(query.toLowerCase()) ||
      challenge.description.toLowerCase().includes(query.toLowerCase())
    const difficultyMatch = difficultyFilter === 'All' || challenge.difficulty === difficultyFilter
    return queryMatch && difficultyMatch
  })

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-white/80 bg-white/85 p-5 sm:p-6">
        <h2 className="text-2xl font-bold text-slate-900">{CATEGORY_LABELS[cat]}</h2>
        <p className="text-slate-600 text-sm mt-1">
          {catChallenges.length} challenge{catChallenges.length !== 1 ? 's' : ''}
        </p>

        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title or description"
            className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value as 'All' | 'Beginner' | 'Intermediate' | 'Advanced')}
            aria-label="Filter by difficulty"
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">All difficulties</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredChallenges.map(challenge => (
          <ChallengeCard
            key={challenge.id}
            challenge={challenge}
            language={lang}
            isCompleted={isCompleted(challenge.id)}
          />
        ))}
        {filteredChallenges.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white/70 p-8 text-center">
            <p className="text-slate-600">No challenges match your search or difficulty filter.</p>
          </div>
        )}
      </div>
    </div>
  )
}
