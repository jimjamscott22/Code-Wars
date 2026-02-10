import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { LANGUAGES, LANGUAGE_LABELS } from '../types.ts'

const LANGUAGE_COLORS: Record<string, string> = {
  python: 'from-blue-500 to-blue-700',
  javascript: 'from-amber-400 to-orange-500',
  java: 'from-rose-500 to-red-700',
}

const LANGUAGE_NOTES: Record<string, string> = {
  python: 'Readable syntax, great for logic and interview prep.',
  javascript: 'Web-native language with versatile problem solving patterns.',
  java: 'Strong typing and OOP structure for robust solutions.',
}

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-white/80 bg-white/85 backdrop-blur-sm shadow-[0_20px_50px_-26px_rgba(30,64,175,0.45)] p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.22em] text-indigo-500 font-semibold mb-3">Training Ground</p>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Choose a language and start your next streak.</h2>
        <p className="text-slate-600 max-w-2xl">
          Follow the top navigation to move between languages, then use category tabs to focus on skills like strings, trees, or sorting.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {LANGUAGES.map((lang) => (
          <Link
            key={lang}
            to={`/${lang}`}
            className={`group block bg-gradient-to-br ${LANGUAGE_COLORS[lang]} text-white rounded-2xl shadow-lg shadow-slate-400/25 p-7 text-left hover:-translate-y-1 hover:shadow-xl transition-all`}
          >
            <h3 className="text-2xl font-bold mb-2">{LANGUAGE_LABELS[lang]}</h3>
            <p className="text-white/85 text-sm mb-5">{LANGUAGE_NOTES[lang]}</p>
            <div className="inline-flex items-center gap-2 text-sm font-medium">
              Browse challenges
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white/85 p-5 sm:p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Usability upgrades now available</h3>
        <p className="text-sm text-slate-600">
          Use the sticky top nav, contextual category bar, and challenge search to move around quickly without losing your place.
        </p>
      </section>
    </div>
  )
}
