export type Language = 'python' | 'javascript' | 'java'

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
}

export const LANGUAGES: Language[] = ['python', 'javascript', 'java']
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
