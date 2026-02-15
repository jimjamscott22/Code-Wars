import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle, Circle, ArrowLeft, ClipboardCopy, Check } from 'lucide-react'
import type { Challenge, Language } from '../types.ts'
import DifficultyBadge from './DifficultyBadge.tsx'
import CodingPlayground from './CodingPlayground.tsx'

interface ChallengeDetailProps {
  challenge: Challenge
  language: Language
  isCompleted: boolean
  onMarkComplete: () => void
}

export default function ChallengeDetail({ challenge, language, isCompleted, onMarkComplete }: ChallengeDetailProps) {
  const [showSolution, setShowSolution] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopySolution = async () => {
    try {
      await navigator.clipboard.writeText(challenge.solutions[language])
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1400)
    } catch {
      // Ignore clipboard failures in unsupported browser contexts.
    }
  }

  return (
    <div className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${isCompleted ? 'ring-2 ring-emerald-500 border-emerald-200' : ''}`}>
      <Link
        to={`/${language}/${challenge.category}`}
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition-colors mb-4"
      >
        <ArrowLeft size={16} />
        Back to {challenge.category} challenges
      </Link>

      <div className="flex items-start justify-between mb-4 gap-3">
        <div className="flex items-center gap-3">
          {isCompleted ? (
            <CheckCircle className="text-emerald-500 shrink-0" size={24} />
          ) : (
            <Circle className="text-slate-400 shrink-0" size={24} />
          )}
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">{challenge.title}</h2>
            <DifficultyBadge difficulty={challenge.difficulty} />
          </div>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-slate-700 mb-3">{challenge.description}</p>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <h4 className="font-medium text-slate-800 mb-2">Examples:</h4>
          <ul className="text-sm text-slate-600 space-y-1">
            {challenge.examples.map((example, idx) => (
              <li key={idx} className="font-mono text-[13px]">{example}</li>
            ))}
          </ul>
        </div>
      </div>

      <CodingPlayground language={language} starterCode={challenge.solutions[language]} />

      <div className="flex flex-wrap gap-3">
        <button
          onClick={onMarkComplete}
          disabled={isCompleted}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            isCompleted
              ? 'bg-emerald-100 text-emerald-800 cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          {isCompleted ? 'Completed!' : 'Mark Complete'}
        </button>

        <button
          onClick={() => setShowSolution(prev => !prev)}
          className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
        >
          {showSolution ? 'Hide Solution' : 'Show Solution'}
        </button>
      </div>

      {showSolution && (
        <div className="mt-4 bg-slate-900 text-slate-100 p-4 rounded-xl">
          <div className="flex items-center justify-between gap-3 mb-2">
            <h4 className="font-medium text-slate-300">Solution ({language}):</h4>
            <button
              type="button"
              onClick={handleCopySolution}
              className="inline-flex items-center gap-2 text-xs text-slate-200 border border-slate-700 rounded-md px-2 py-1 hover:bg-slate-800 transition-colors"
            >
              {copied ? <Check size={14} /> : <ClipboardCopy size={14} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <pre className="text-sm overflow-x-auto">
            <code>{challenge.solutions[language]}</code>
          </pre>
        </div>
      )}
    </div>
  )
}
