import type { Difficulty } from '../types.ts'

function getDifficultyClasses(difficulty: Difficulty): string {
  switch (difficulty) {
    case 'Beginner':
      return 'text-emerald-700 bg-emerald-100'
    case 'Intermediate':
      return 'text-amber-700 bg-amber-100'
    case 'Advanced':
      return 'text-rose-700 bg-rose-100'
  }
}

export default function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return (
    <span className={`inline-block px-2 py-1 rounded-full text-sm font-medium ${getDifficultyClasses(difficulty)}`}>
      {difficulty}
    </span>
  )
}
