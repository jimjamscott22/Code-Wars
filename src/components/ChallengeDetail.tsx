import { useState } from 'react'
import { CheckCircle, Circle } from 'lucide-react'
import type { Challenge, Language } from '../types.ts'
import DifficultyBadge from './DifficultyBadge.tsx'

interface ChallengeDetailProps {
  challenge: Challenge
  language: Language
  isCompleted: boolean
  onMarkComplete: () => void
}

export default function ChallengeDetail({ challenge, language, isCompleted, onMarkComplete }: ChallengeDetailProps) {
  const [showSolution, setShowSolution] = useState(false)

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${isCompleted ? 'ring-2 ring-green-500' : ''}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {isCompleted ? (
            <CheckCircle className="text-green-500 shrink-0" size={24} />
          ) : (
            <Circle className="text-gray-400 shrink-0" size={24} />
          )}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">{challenge.title}</h2>
            <DifficultyBadge difficulty={challenge.difficulty} />
          </div>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-gray-700 mb-3">{challenge.description}</p>
        <div className="bg-gray-50 p-3 rounded-md">
          <h4 className="font-medium text-gray-800 mb-2">Examples:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            {challenge.examples.map((example, idx) => (
              <li key={idx} className="font-mono">{example}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onMarkComplete}
          disabled={isCompleted}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            isCompleted
              ? 'bg-green-100 text-green-800 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {isCompleted ? 'Completed!' : 'Mark Complete'}
        </button>

        <button
          onClick={() => setShowSolution(prev => !prev)}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
        >
          {showSolution ? 'Hide Solution' : 'Show Solution'}
        </button>
      </div>

      {showSolution && (
        <div className="mt-4 bg-gray-900 text-gray-100 p-4 rounded-md">
          <h4 className="font-medium mb-2 text-gray-300">
            Solution ({language}):
          </h4>
          <pre className="text-sm overflow-x-auto">
            <code>{challenge.solutions[language]}</code>
          </pre>
        </div>
      )}
    </div>
  )
}
