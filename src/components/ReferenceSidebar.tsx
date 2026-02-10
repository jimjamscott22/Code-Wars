import { useEffect, useState } from 'react'
import { BookOpen, ExternalLink, NotebookPen, Eraser } from 'lucide-react'
import { LANGUAGES, LANGUAGE_LABELS } from '../types.ts'
import type { Language } from '../types.ts'

interface ReferenceSidebarProps {
  activeLanguage?: Language
}

interface ReferenceLink {
  label: string
  url: string
  description: string
}

const NOTES_STORAGE_KEY = 'coding-challenges-language-notes'

const REFERENCE_LINKS: Record<Language, ReferenceLink[]> = {
  python: [
    {
      label: 'Python Docs',
      url: 'https://docs.python.org/3/',
      description: 'Official language reference and standard library docs.',
    },
    {
      label: 'Real Python',
      url: 'https://realpython.com/',
      description: 'Practical tutorials and deep-dive explainers.',
    },
    {
      label: 'PyPI',
      url: 'https://pypi.org/',
      description: 'Package index for Python libraries and tools.',
    },
  ],
  javascript: [
    {
      label: 'MDN JavaScript',
      url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
      description: 'Authoritative JS syntax and API documentation.',
    },
    {
      label: 'javascript.info',
      url: 'https://javascript.info/',
      description: 'Concept-first modern JavaScript tutorials.',
    },
    {
      label: 'Node.js Docs',
      url: 'https://nodejs.org/docs/latest/api/',
      description: 'Runtime APIs and server-side JavaScript reference.',
    },
  ],
  java: [
    {
      label: 'Oracle Java Docs',
      url: 'https://docs.oracle.com/en/java/',
      description: 'Official Java language and JDK documentation.',
    },
    {
      label: 'Baeldung Java',
      url: 'https://www.baeldung.com/',
      description: 'Well-structured Java and Spring tutorials.',
    },
    {
      label: 'GeeksforGeeks Java',
      url: 'https://www.geeksforgeeks.org/java/',
      description: 'Quick examples and interview-style Java topics.',
    },
  ],
}

type NotesByLanguage = Record<Language, string>

function getInitialNotes(): NotesByLanguage {
  const emptyNotes: NotesByLanguage = {
    python: '',
    javascript: '',
    java: '',
  }

  try {
    const raw = window.localStorage.getItem(NOTES_STORAGE_KEY)
    if (!raw) return emptyNotes
    const parsed = JSON.parse(raw) as Partial<NotesByLanguage>
    return {
      python: parsed.python ?? '',
      javascript: parsed.javascript ?? '',
      java: parsed.java ?? '',
    }
  } catch {
    return emptyNotes
  }
}

export default function ReferenceSidebar({ activeLanguage }: ReferenceSidebarProps) {
  const [notesByLanguage, setNotesByLanguage] = useState<NotesByLanguage>(getInitialNotes)

  const orderedLanguages = activeLanguage
    ? [activeLanguage, ...LANGUAGES.filter((lang) => lang !== activeLanguage)]
    : LANGUAGES

  useEffect(() => {
    window.localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notesByLanguage))
  }, [notesByLanguage])

  const handleNoteChange = (language: Language, value: string) => {
    setNotesByLanguage((prev) => ({
      ...prev,
      [language]: value,
    }))
  }

  const clearNote = (language: Language) => {
    setNotesByLanguage((prev) => ({
      ...prev,
      [language]: '',
    }))
  }

  return (
    <aside className="rounded-2xl border border-white/90 bg-white/85 backdrop-blur-sm p-4 sm:p-5 shadow-[0_20px_40px_-28px_rgba(15,23,42,0.45)] lg:sticky lg:top-36">
      <div className="flex items-center gap-2 mb-3">
        <BookOpen size={18} className="text-indigo-600" />
        <h3 className="text-base font-semibold text-slate-900">Reference Hub</h3>
      </div>
      <p className="text-xs text-slate-500 mb-4">
        Quick links to commonly used docs and learning resources for each language.
      </p>

      <div className="space-y-4">
        {orderedLanguages.map((language) => (
          <section key={language} className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-3">
            <h4 className="text-sm font-semibold text-slate-800 mb-2">
              {LANGUAGE_LABELS[language]}
            </h4>
            <ul className="space-y-2">
              {REFERENCE_LINKS[language].map((link) => (
                <li key={link.url}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block rounded-lg border border-transparent p-2 hover:border-indigo-200 hover:bg-white transition-colors"
                  >
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-700 group-hover:text-indigo-800">
                      {link.label}
                      <ExternalLink size={12} />
                    </span>
                    <span className="block text-xs text-slate-500 mt-0.5">{link.description}</span>
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-3 rounded-lg border border-slate-200 bg-white p-2.5">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                  <NotebookPen size={13} />
                  Quick notes
                </span>
                {notesByLanguage[language].trim().length > 0 && (
                  <button
                    type="button"
                    onClick={() => clearNote(language)}
                    className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-rose-600 transition-colors"
                  >
                    <Eraser size={12} />
                    Clear
                  </button>
                )}
              </div>
              <textarea
                value={notesByLanguage[language]}
                onChange={(e) => handleNoteChange(language, e.target.value)}
                placeholder={`Jot down ${LANGUAGE_LABELS[language]} tips, syntax reminders, or patterns...`}
                className="w-full min-h-[86px] resize-y rounded-md border border-slate-200 px-2 py-1.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </section>
        ))}
      </div>
    </aside>
  )
}
