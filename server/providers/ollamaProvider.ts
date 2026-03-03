import { ProviderError, createTimeoutError, isAbortError } from './base.ts'
import type { ChatProvider } from './base.ts'
import type { ProviderChatInput, ProviderHealthResult } from '../types.ts'

interface OllamaChatResponse {
  message?: {
    content?: string
  }
}

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
}

export function createOllamaProvider(baseUrl: string): ChatProvider {
  const normalizedBaseUrl = normalizeBaseUrl(baseUrl)

  const handleNetworkError = (error: unknown, message: string): never => {
    if (isAbortError(error)) {
      throw createTimeoutError()
    }

    throw new ProviderError('UPSTREAM_UNAVAILABLE', `${message} (${normalizedBaseUrl}).`, 503)
  }

  const checkHealth = async (signal: AbortSignal): Promise<ProviderHealthResult> => {
    try {
      const response = await fetch(`${normalizedBaseUrl}/api/tags`, { signal })
      return {
        detail: response.ok ? 'Ollama is reachable.' : `Ollama returned HTTP ${response.status}.`,
        reachable: response.ok,
      }
    } catch (error) {
      if (isAbortError(error)) {
        return {
          detail: 'Timed out while checking the Ollama endpoint.',
          reachable: false,
        }
      }

      return {
        detail: `Ollama is not reachable at ${normalizedBaseUrl}.`,
        reachable: false,
      }
    }
  }

  const sendChat = async ({ messages, model, signal }: ProviderChatInput) => {
    const fetchResponse = async (): Promise<Response> => {
      try {
        return await fetch(`${normalizedBaseUrl}/api/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model,
            messages,
            stream: false,
          }),
          signal,
        })
      } catch (error) {
        return handleNetworkError(error, 'Ollama is not reachable at')
      }
    }

    const response = await fetchResponse()

    if (!response.ok) {
      throw new ProviderError(
        'UPSTREAM_BAD_RESPONSE',
        `Ollama returned HTTP ${response.status} while generating a reply.`,
      )
    }

    let payload: OllamaChatResponse

    try {
      payload = (await response.json()) as OllamaChatResponse
    } catch {
      throw new ProviderError('UPSTREAM_BAD_RESPONSE', 'Ollama returned invalid JSON.')
    }

    const content = payload.message?.content?.trim()
    if (!content) {
      throw new ProviderError('UPSTREAM_BAD_RESPONSE', 'Ollama returned an empty assistant message.')
    }

    return { content }
  }

  return {
    name: 'ollama',
    checkHealth,
    sendChat,
  }
}
