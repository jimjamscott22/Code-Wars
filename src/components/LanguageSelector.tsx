import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Code } from 'lucide-react'
import { LANGUAGES, LANGUAGE_LABELS } from '../types.ts'
import type { Language } from '../types.ts'

const LAST_WORKED_STORAGE_KEY = 'coding-challenges-last-worked'

type LastWorkedMap = Record<Language, number | null>

function loadLastWorkedMap(): LastWorkedMap {
  const initialMap: LastWorkedMap = {
    python: null,
    javascript: null,
    java: null,
  }

  try {
    const raw = window.localStorage.getItem(LAST_WORKED_STORAGE_KEY)
    if (!raw) return initialMap
    const parsed = JSON.parse(raw) as Partial<Record<Language, number | null>>
    return {
      python: typeof parsed.python === 'number' ? parsed.python : null,
      javascript: typeof parsed.javascript === 'number' ? parsed.javascript : null,
      java: typeof parsed.java === 'number' ? parsed.java : null,
    }
  } catch {
    return initialMap
  }
}

export default function LanguageSelector() {
  const { language, category, challengeId } = useParams()
  const navigate = useNavigate()
  const selectedLanguage = language && LANGUAGES.includes(language as Language)
    ? (language as Language)
    : undefined

  const [lastWorkedMap, setLastWorkedMap] = useState<LastWorkedMap>(() => {
    const loaded = loadLastWorkedMap()
    if (!selectedLanguage) return loaded
    return {
      ...loaded,
      [selectedLanguage]: Date.now(),
    }
  })

  useEffect(() => {
    window.localStorage.setItem(LAST_WORKED_STORAGE_KEY, JSON.stringify(lastWorkedMap))
  }, [lastWorkedMap])

  if (!selectedLanguage) return null

  const ts = lastWorkedMap[selectedLanguage]
  const lastWorkedText = ts
    ? new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(ts)
    : 'No activity yet'

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value as Language
    setLastWorkedMap((prev) => ({
      ...prev,
      [newLang]: Date.now(),
    }))
    let path = `/${newLang}`
    if (category) path += `/${category}`
    if (challengeId) path += `/${challengeId}`
    navigate(path)
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
      <div className="inline-flex items-center gap-2">
        <Code className="text-indigo-500" size={18} />
        <span className="text-slate-500 text-sm">Language</span>
        <select
          value={language}
          onChange={handleChange}
          aria-label="Select language"
          className="px-2 py-1 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-slate-50 text-slate-700"
        >
          {LANGUAGES.map(lang => (
            <option key={lang} value={lang}>
              {LANGUAGE_LABELS[lang]}
            </option>
          ))}
        </select>
      </div>
      <p className="mt-1 text-xs text-slate-500">
        Last worked on {LANGUAGE_LABELS[selectedLanguage]}: <span className="text-slate-700">{lastWorkedText}</span>
      </p>
    </div>
  )
}
