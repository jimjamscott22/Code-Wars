import { Outlet, Link, useParams } from 'react-router-dom'
import { Trophy, Home, Code2, FolderKanban, ChevronRight, RotateCcw } from 'lucide-react'
import LanguageSelector from './LanguageSelector.tsx'
import ProgressBar from './ProgressBar.tsx'
import ReferenceSidebar from './ReferenceSidebar.tsx'
import { useProgress } from '../hooks/useProgress.ts'
import { challenges, getChallengesByCategory } from '../data/challenges.ts'
import { CATEGORIES, CATEGORY_LABELS, LANGUAGES, LANGUAGE_LABELS } from '../types.ts'
import type { Language, Category } from '../types.ts'

export default function Layout() {
  const { language, category, challengeId } = useParams()
  const { completedCount, isCompleted, resetProgress } = useProgress()
  const activeLanguage = language && LANGUAGES.includes(language as Language)
    ? (language as Language)
    : undefined

  return (
    <div className="max-w-5xl mx-auto px-4 py-4 sm:px-6 sm:py-6 min-h-screen">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-3 focus:py-2 focus:rounded-lg focus:bg-slate-900 focus:text-white"
      >
        Skip to main content
      </a>

      <header className="sticky top-3 z-20 mb-6">
        <div className="rounded-2xl border border-white/80 bg-[var(--surface)] backdrop-blur-xl shadow-[0_20px_45px_-24px_rgba(37,99,235,0.45)] px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
                <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30">
                  <Trophy size={24} />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Coding Challenges</h1>
                  <p className="text-sm text-slate-600">Sharpen skills with guided problem solving.</p>
                </div>
              </Link>

              <div className="flex flex-wrap items-center gap-3">
                <ProgressBar completed={completedCount} total={challenges.length} />
                {completedCount > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Reset all completed challenge progress?')) {
                        resetProgress()
                      }
                    }}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-600 text-sm hover:bg-slate-50 hover:text-slate-900 transition-colors"
                  >
                    <RotateCcw size={16} />
                    Reset progress
                  </button>
                )}
              </div>
            </div>

            <nav className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2">
              <Link
                to="/"
                className={`inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                  !language
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Home size={16} />
                Home
              </Link>
              {LANGUAGES.map((lang) => (
                <Link
                  key={lang}
                  to={`/${lang}`}
                  className={`inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                    language === lang
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                      : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Code2 size={16} />
                  {LANGUAGE_LABELS[lang]}
                </Link>
              ))}
            </nav>

            {activeLanguage && (
              <nav className="rounded-xl border border-slate-200/70 bg-white/70 p-2 flex flex-wrap gap-2">
                <Link
                  to={`/${activeLanguage}`}
                  className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    !category
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <FolderKanban size={16} />
                  All categories
                </Link>
                {CATEGORIES.map((cat) => {
                  const catChallenges = getChallengesByCategory(cat)
                  const completedInCategory = catChallenges.filter((challenge) => isCompleted(challenge.id)).length
                  const isCurrentCategory = category === cat
                  return (
                    <Link
                      key={cat}
                      to={`/${activeLanguage}/${cat}`}
                      className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        isCurrentCategory
                          ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                          : 'bg-white text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span>{CATEGORY_LABELS[cat]}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${isCurrentCategory ? 'bg-white/25' : 'bg-slate-100 text-slate-500'}`}>
                        {completedInCategory}/{catChallenges.length}
                      </span>
                    </Link>
                  )
                })}
              </nav>
            )}

            <div className="flex items-center justify-between gap-3 flex-wrap">
              <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
                {language && (
                  <>
                    <ChevronRight size={14} className="text-slate-300" />
                    <Link to={`/${language}`} className="hover:text-indigo-600 transition-colors">
                      {LANGUAGE_LABELS[language as Language] ?? language}
                    </Link>
                  </>
                )}
                {category && (
                  <>
                    <ChevronRight size={14} className="text-slate-300" />
                    <Link to={`/${language}/${category}`} className="hover:text-indigo-600 transition-colors">
                      {CATEGORY_LABELS[category as Category] ?? category}
                    </Link>
                  </>
                )}
                {challengeId && (
                  <>
                    <ChevronRight size={14} className="text-slate-300" />
                    <span className="text-slate-700">{challengeId}</span>
                  </>
                )}
              </nav>
              <LanguageSelector key={`${language ?? 'home'}-${category ?? 'root'}-${challengeId ?? 'list'}`} />
            </div>
          </div>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_290px] items-start">
        <main id="main-content">
          <Outlet />
        </main>
        <ReferenceSidebar activeLanguage={activeLanguage} />
      </div>
    </div>
  )
}
