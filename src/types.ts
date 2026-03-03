export type Language = 'python' | 'javascript' | 'java' | 'sql' | 'c'

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced'

export type Category = 'basics' | 'strings' | 'hash-maps' | 'trees' | 'sorting'

export const CATEGORY_LABELS: Record<Category, string> = {
  'basics': 'Basics',
  'strings': 'Strings',
  'hash-maps': 'Hash Maps',
  'trees': 'Trees',
  'sorting': 'Sorting',
}

export const LANGUAGE_LABELS: Record<Language, string> = {
  python: 'Python',
  javascript: 'JavaScript',
  java: 'Java',
  sql: 'SQL',
  c: 'C',
}

export const LANGUAGES: Language[] = ['python', 'javascript', 'java', 'sql', 'c']
export const CATEGORIES: Category[] = ['basics', 'strings', 'hash-maps', 'trees', 'sorting']

export interface Challenge {
  id: string
  title: string
  category: Category
  difficulty: Difficulty
  description: string
  examples: string[]
  solutions: Record<Language, string>
}

export type ChatRole = 'user' | 'assistant'

export interface ChatMessage {
  id: string
  role: ChatRole
  content: string
  createdAt: number
}

export interface ChallengeChatContext {
  challengeId: string
  title: string
  category: Category
  language: Language
  description: string
  examples: string[]
  editorCode: string
}

export interface ChatRequest {
  context: ChallengeChatContext
  messages: ChatMessage[]
}

export interface ChatResponse {
  message: ChatMessage
  provider: 'ollama' | 'lm-studio'
  model: string
}
