import type { ProviderChatInput, ProviderChatResult, ProviderHealthResult, ProviderName } from '../types.ts'

export type ProviderErrorCode = 'UPSTREAM_UNAVAILABLE' | 'UPSTREAM_BAD_RESPONSE' | 'REQUEST_TIMEOUT'

export class ProviderError extends Error {
  code: ProviderErrorCode
  status: number

  constructor(code: ProviderErrorCode, message: string, status = 502) {
    super(message)
    this.name = 'ProviderError'
    this.code = code
    this.status = status
  }
}

export interface ChatProvider {
  name: ProviderName
  checkHealth: (signal: AbortSignal) => Promise<ProviderHealthResult>
  sendChat: (input: ProviderChatInput) => Promise<ProviderChatResult>
}

export function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === 'AbortError'
}

export function createTimeoutError(message = 'The chat request timed out before the local model responded.'): ProviderError {
  return new ProviderError('REQUEST_TIMEOUT', message, 504)
}
