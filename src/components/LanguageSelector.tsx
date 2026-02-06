import { useNavigate, useParams } from 'react-router-dom'
import { Code } from 'lucide-react'
import { LANGUAGES, LANGUAGE_LABELS } from '../types.ts'
import type { Language } from '../types.ts'

export default function LanguageSelector() {
  const { language, category, challengeId } = useParams()
  const navigate = useNavigate()

  if (!language) return null

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value as Language
    let path = `/${newLang}`
    if (category) path += `/${category}`
    if (challengeId) path += `/${challengeId}`
    navigate(path)
  }

  return (
    <div className="flex items-center gap-2">
      <Code className="text-blue-500" size={20} />
      <span className="text-gray-600 text-sm">Language:</span>
      <select
        value={language}
        onChange={handleChange}
        className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
      >
        {LANGUAGES.map(lang => (
          <option key={lang} value={lang}>
            {LANGUAGE_LABELS[lang]}
          </option>
        ))}
      </select>
    </div>
  )
}
