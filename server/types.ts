export type ProviderName = 'ollama' | 'lm-studio'
export type ProviderMessageRole = 'system' | 'user' | 'assistant'

export interface IncomingChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: number
}

export interface IncomingChatContext {
  challengeId: string
  title: string
  category: string
  language: string
  description: string
  examples: string[]
  editorCode: string
}

export interface ChatRequestBody {
  context: IncomingChatContext
  messages: IncomingChatMessage[]
}

export interface ProviderMessage {
  role: ProviderMessageRole
  content: string
}

export interface ProviderChatInput {
  messages: ProviderMessage[]
  model: string
  signal: AbortSignal
}

export interface ProviderChatResult {
  content: string
}

export interface ProviderHealthResult {
  detail?: string
  reachable: boolean
}
