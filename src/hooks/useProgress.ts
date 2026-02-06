import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'coding-challenges-progress'

function loadCompleted(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed)) return parsed
    }
  } catch { /* ignore */ }
  return []
}

export function useProgress() {
  const [completedChallenges, setCompletedChallenges] = useState<string[]>(loadCompleted)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(completedChallenges))
  }, [completedChallenges])

  const markComplete = useCallback((challengeId: string) => {
    setCompletedChallenges(prev =>
      prev.includes(challengeId) ? prev : [...prev, challengeId]
    )
  }, [])

  const isCompleted = useCallback(
    (challengeId: string) => completedChallenges.includes(challengeId),
    [completedChallenges]
  )

  const resetProgress = useCallback(() => {
    setCompletedChallenges([])
  }, [])

  return {
    completedChallenges,
    completedCount: completedChallenges.length,
    markComplete,
    isCompleted,
    resetProgress,
  }
}
