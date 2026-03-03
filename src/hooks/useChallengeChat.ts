import { useEffect, useState } from 'react'
import type { ChatMessage, ChatResponse, ChallengeChatContext } from '../types.ts'

const MAX_STORED_MESSAGES = 20

interface ApiErrorPayload {
  error?: {
    code?: string
    message?: string
  }
}

interface UseChallengeChatResult {
  error: string | null
  isLoading: boolean
  messages: ChatMessage[]
  clearChat: () => void
  sendMessage: (content: string) => Promise<boolean>
}

function createChatStorageKey(context: ChallengeChatContext): string {
  return `challenge-chat:${context.language}:${context.challengeId}`
}

function trimMessages(messages: ChatMessage[]): ChatMessage[] {
  return messages.slice(-MAX_STORED_MESSAGES)
}

function createMessage(role: ChatMessage['role'], content: string): ChatMessage {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    content,
    createdAt: Date.now(),
  }
}

function parseStoredMessages(rawValue: string | null): ChatMessage[] {
  if (!rawValue) {
    return []
  }

  try {
    const parsed = JSON.parse(rawValue)
    if (!Array.isArray(parsed)) {
      return []
    }

    return trimMessages(
      parsed.filter((message): message is ChatMessage => (
        typeof message === 'object' &&
        message !== null &&
        (message.role === 'user' || message.role === 'assistant') &&
        typeof message.content === 'string' &&
        typeof message.id === 'string' &&
        typeof message.createdAt === 'number'
      )),
    )
  } catch {
    return []
  }
}

async function getErrorMessage(response: Response): Promise<string> {
  try {
    const payload = (await response.json()) as ApiErrorPayload
    if (payload.error?.message) {
      return payload.error.message
    }
  } catch {
    // Ignore malformed JSON payloads and fall through to the generic message.
  }

  if (response.status >= 500) {
    return 'The chat service is unavailable right now. Start the local backend and try again.'
  }

  return 'The request could not be sent. Review your message and try again.'
}

export function useChallengeChat(context: ChallengeChatContext): UseChallengeChatResult {
  const storageKey = createChatStorageKey(context)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hydratedStorageKey, setHydratedStorageKey] = useState<string | null>(null)

  useEffect(() => {
    setMessages(parseStoredMessages(window.localStorage.getItem(storageKey)))
    setError(null)
    setHydratedStorageKey(storageKey)
  }, [storageKey])

  useEffect(() => {
    if (hydratedStorageKey !== storageKey) {
      return
    }
    window.localStorage.setItem(storageKey, JSON.stringify(trimMessages(messages)))
  }, [hydratedStorageKey, messages, storageKey])

  const clearChat = () => {
    setMessages([])
    setError(null)
    setHydratedStorageKey(null)
    window.localStorage.removeItem(storageKey)
  }

  const sendMessage = async (content: string) => {
    const trimmedContent = content.trim()
    if (!trimmedContent || isLoading) {
      return false
    }

    const nextUserMessage = createMessage('user', trimmedContent)

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          context,
          messages: trimMessages([...messages, nextUserMessage]),
        }),
      })

      if (!response.ok) {
        setError(await getErrorMessage(response))
        return false
      }

      const payload = (await response.json()) as ChatResponse
      if (!payload.message || payload.message.role !== 'assistant' || typeof payload.message.content !== 'string') {
        setError('The chat service returned an invalid response. Check the local model adapter and try again.')
        return false
      }

      setHydratedStorageKey(storageKey)
      setMessages((currentMessages) => trimMessages([...currentMessages, nextUserMessage, payload.message]))
      return true
    } catch {
      setError('The chat service is unavailable right now. Start Ollama or LM Studio and try again.')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return {
    error,
    isLoading,
    messages,
    clearChat,
    sendMessage,
  }
}

export default useChallengeChat
