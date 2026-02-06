import { Outlet, Link, useParams } from 'react-router-dom'
import { Trophy } from 'lucide-react'
import LanguageSelector from './LanguageSelector.tsx'
import ProgressBar from './ProgressBar.tsx'
import { useProgress } from '../hooks/useProgress.ts'
import { challenges } from '../data/challenges.ts'
import { CATEGORY_LABELS, LANGUAGE_LABELS } from '../types.ts'
import type { Language, Category } from '../types.ts'

export default function Layout() {
  const { language, category, challengeId } = useParams()
  const { completedCount } = useProgress()

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen">
      <header className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Trophy className="text-yellow-500" size={32} />
            <h1 className="text-3xl font-bold text-gray-800">Coding Challenges</h1>
          </Link>
        </div>

        <div className="flex items-center gap-6 flex-wrap">
          <LanguageSelector />
          <ProgressBar completed={completedCount} total={challenges.length} />
        </div>
      </header>

      {/* Breadcrumbs */}
      <nav className="mb-4 text-sm text-gray-500">
        <Link to="/" className="hover:text-blue-500">Home</Link>
        {language && (
          <>
            <span className="mx-2">/</span>
            <Link to={`/${language}`} className="hover:text-blue-500">
              {LANGUAGE_LABELS[language as Language] ?? language}
            </Link>
          </>
        )}
        {category && (
          <>
            <span className="mx-2">/</span>
            <Link to={`/${language}/${category}`} className="hover:text-blue-500">
              {CATEGORY_LABELS[category as Category] ?? category}
            </Link>
          </>
        )}
        {challengeId && (
          <>
            <span className="mx-2">/</span>
            <span className="text-gray-700">{challengeId}</span>
          </>
        )}
      </nav>

      <Outlet />
    </div>
  )
}
