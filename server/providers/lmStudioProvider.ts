import { ProviderError, createTimeoutError, isAbortError } from './base.ts'
import type { ChatProvider } from './base.ts'
import type { ProviderChatInput, ProviderHealthResult } from '../types.ts'

interface LmStudioResponse {
  choices?: Array<{
    message?: {
      content?: string
    }
  }>
}

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
}

export function createLmStudioProvider(baseUrl: string): ChatProvider {
  const normalizedBaseUrl = normalizeBaseUrl(baseUrl)

  const handleNetworkError = (error: unknown, message: string): never => {
    if (isAbortError(error)) {
      throw createTimeoutError()
    }

    throw new ProviderError('UPSTREAM_UNAVAILABLE', `${message} ${normalizedBaseUrl}.`, 503)
  }

  const checkHealth = async (signal: AbortSignal): Promise<ProviderHealthResult> => {
    try {
      const response = await fetch(`${normalizedBaseUrl}/v1/models`, { signal })
      return {
        detail: response.ok ? 'LM Studio is reachable.' : `LM Studio returned HTTP ${response.status}.`,
        reachable: response.ok,
      }
    } catch (error) {
      if (isAbortError(error)) {
        return {
          detail: 'Timed out while checking the LM Studio endpoint.',
          reachable: false,
        }
      }

      return {
        detail: `LM Studio is not reachable at ${normalizedBaseUrl}.`,
        reachable: false,
      }
    }
  }

  const sendChat = async ({ messages, model, signal }: ProviderChatInput) => {
    const fetchResponse = async (): Promise<Response> => {
      try {
        return await fetch(`${normalizedBaseUrl}/v1/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model,
            messages,
            temperature: 0.3,
          }),
          signal,
        })
      } catch (error) {
        return handleNetworkError(error, 'LM Studio is not reachable at')
      }
    }

    const response = await fetchResponse()

    if (!response.ok) {
      throw new ProviderError(
        'UPSTREAM_BAD_RESPONSE',
        `LM Studio returned HTTP ${response.status} while generating a reply.`,
      )
    }

    let payload: LmStudioResponse

    try {
      payload = (await response.json()) as LmStudioResponse
    } catch {
      throw new ProviderError('UPSTREAM_BAD_RESPONSE', 'LM Studio returned invalid JSON.')
    }

    const content = payload.choices?.[0]?.message?.content?.trim()
    if (!content) {
      throw new ProviderError('UPSTREAM_BAD_RESPONSE', 'LM Studio returned an empty assistant message.')
    }

    return { content }
  }

  return {
    name: 'lm-studio',
    checkHealth,
    sendChat,
  }
}
