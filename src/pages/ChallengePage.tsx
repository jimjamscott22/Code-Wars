import { useParams, Navigate } from 'react-router-dom'
import ChallengeDetail from '../components/ChallengeDetail.tsx'
import { useProgress } from '../hooks/useProgress.ts'
import { LANGUAGES, CATEGORIES } from '../types.ts'
import type { Language, Category } from '../types.ts'
import { getChallengeById } from '../data/challenges.ts'

export default function ChallengePage() {
  const { language, category, challengeId } = useParams()
  const { isCompleted, markComplete } = useProgress()

  if (!language || !LANGUAGES.includes(language as Language)) {
    return <Navigate to="/" replace />
  }
  if (!category || !CATEGORIES.includes(category as Category)) {
    return <Navigate to={`/${language}`} replace />
  }

  const challenge = challengeId ? getChallengeById(challengeId) : undefined

  if (!challenge || challenge.category !== category) {
    return <Navigate to={`/${language}/${category}`} replace />
  }

  return (
    <ChallengeDetail
      challenge={challenge}
      language={language as Language}
      isCompleted={isCompleted(challenge.id)}
      onMarkComplete={() => markComplete(challenge.id)}
    />
  )
}
