import { Link } from 'react-router-dom'
import { LANGUAGES, LANGUAGE_LABELS } from '../types.ts'

const LANGUAGE_COLORS: Record<string, string> = {
  python: 'from-blue-500 to-blue-700',
  javascript: 'from-yellow-400 to-yellow-600',
  java: 'from-red-500 to-red-700',
}

export default function HomePage() {
  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Choose a Language</h2>
        <p className="text-gray-600">Pick a programming language to start solving challenges.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {LANGUAGES.map(lang => (
          <Link
            key={lang}
            to={`/${lang}`}
            className={`block bg-gradient-to-br ${LANGUAGE_COLORS[lang]} text-white rounded-lg shadow-lg p-8 text-center hover:scale-105 transition-transform`}
          >
            <h3 className="text-2xl font-bold mb-2">{LANGUAGE_LABELS[lang]}</h3>
            <p className="text-white/80 text-sm">Browse challenges</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
