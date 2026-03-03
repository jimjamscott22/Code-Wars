import { useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import ChallengeDetail from '../components/ChallengeDetail.tsx'
import CategoryTipsPanel from '../components/CategoryTipsPanel.tsx'
import ChallengeChatPanel from '../components/ChallengeChatPanel.tsx'
import { useProgress } from '../hooks/useProgress.ts'
import { LANGUAGES, CATEGORIES } from '../types.ts'
import type { Challenge, ChallengeChatContext, Language, Category } from '../types.ts'
import { getChallengeById } from '../data/challenges.ts'

interface ChallengeWorkspaceProps {
  challenge: Challenge
  language: Language
  isCompleted: boolean
  onMarkComplete: () => void
}

function ChallengeWorkspace({ challenge, language, isCompleted, onMarkComplete }: ChallengeWorkspaceProps) {
  const [editorCode, setEditorCode] = useState(challenge.solutions[language])

  const chatContext: ChallengeChatContext = {
    challengeId: challenge.id,
    title: challenge.title,
    category: challenge.category,
    language,
    description: challenge.description,
    examples: challenge.examples,
    editorCode,
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)] items-start">
      <div className="space-y-5 lg:sticky lg:top-28">
        <CategoryTipsPanel category={challenge.category} language={language} />
        <ChallengeChatPanel context={chatContext} />
      </div>
      <ChallengeDetail
        challenge={challenge}
        language={language}
        editorCode={editorCode}
        isCompleted={isCompleted}
        onEditorCodeChange={setEditorCode}
        onMarkComplete={onMarkComplete}
      />
    </div>
  )
}

export default function ChallengePage() {
  const { language, category, challengeId } = useParams()
  const { isCompleted, markComplete } = useProgress()
  const activeLanguage = language && LANGUAGES.includes(language as Language)
    ? (language as Language)
    : null
  const activeCategory = category && CATEGORIES.includes(category as Category)
    ? (category as Category)
    : null
  const challenge = challengeId ? getChallengeById(challengeId) : undefined

  if (!activeLanguage) {
    return <Navigate to="/" replace />
  }
  if (!activeCategory) {
    return <Navigate to={`/${activeLanguage}`} replace />
  }
  if (!challenge || challenge.category !== activeCategory) {
    return <Navigate to={`/${activeLanguage}/${activeCategory}`} replace />
  }

  return (
    <ChallengeWorkspace
      key={`${activeLanguage}:${challenge.id}`}
      challenge={challenge}
      language={activeLanguage}
      isCompleted={isCompleted(challenge.id)}
      onMarkComplete={() => markComplete(challenge.id)}
    />
  )
}
