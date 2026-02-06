import type { Difficulty } from '../types.ts'

function getDifficultyClasses(difficulty: Difficulty): string {
  switch (difficulty) {
    case 'Beginner':
      return 'text-green-600 bg-green-100'
    case 'Intermediate':
      return 'text-orange-600 bg-orange-100'
    case 'Advanced':
      return 'text-red-600 bg-red-100'
  }
}

export default function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return (
    <span className={`inline-block px-2 py-1 rounded-full text-sm font-medium ${getDifficultyClasses(difficulty)}`}>
      {difficulty}
    </span>
  )
}
