import type { ProviderName } from './types.ts'

const DEFAULT_PORT = 8787
const DEFAULT_TIMEOUT_MS = 30_000
const DEFAULT_MODEL = 'llama3.1'

function readNumber(rawValue: string | undefined, fallback: number): number {
  if (!rawValue) {
    return fallback
  }

  const parsed = Number(rawValue)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

function readProvider(rawValue: string | undefined): ProviderName {
  return rawValue === 'lm-studio' ? 'lm-studio' : 'ollama'
}

export interface ChatServerConfig {
  chatModel: string
  provider: ProviderName
  requestTimeoutMs: number
  port: number
  ollamaBaseUrl: string
  lmStudioBaseUrl: string
}

export function getConfig(): ChatServerConfig {
  return {
    chatModel: process.env.CHAT_MODEL?.trim() || DEFAULT_MODEL,
    provider: readProvider(process.env.CHAT_PROVIDER),
    requestTimeoutMs: readNumber(process.env.CHAT_REQUEST_TIMEOUT_MS, DEFAULT_TIMEOUT_MS),
    port: readNumber(process.env.CHAT_API_PORT, DEFAULT_PORT),
    ollamaBaseUrl: process.env.OLLAMA_BASE_URL?.trim() || 'http://127.0.0.1:11434',
    lmStudioBaseUrl: process.env.LM_STUDIO_BASE_URL?.trim() || 'http://127.0.0.1:1234',
  }
}
