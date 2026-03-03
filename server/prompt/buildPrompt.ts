import type { ChatRequestBody, ProviderMessage } from '../types.ts'

const MAX_HISTORY_MESSAGES = 10

const SYSTEM_PROMPT = [
  'You are a coding tutor embedded in a coding-challenge app.',
  'Stay focused on the active challenge, selected language, and the user\'s current code.',
  'Prefer hints, decomposition, debugging guidance, edge cases, and next steps over direct solutions.',
  'Do not provide a complete answer immediately.',
  'If the user repeatedly asks for more direct help, you may become more explicit, but keep teaching the reasoning.',
  'Keep responses concise: short explanation, one next step, and only a small snippet or pseudocode when helpful.',
  'Avoid unrelated tangents and do not paste the built-in reference solution unless the conversation clearly escalates there.',
].join(' ')

function buildContextBlock(request: ChatRequestBody): string {
  const { context } = request
  const exampleLines = context.examples.map((example, index) => `${index + 1}. ${example}`).join('\n')

  return [
    `Challenge ID: ${context.challengeId}`,
    `Title: ${context.title}`,
    `Category: ${context.category}`,
    `Language: ${context.language}`,
    `Description: ${context.description}`,
    'Examples:',
    exampleLines || 'None provided.',
    'Current editor code:',
    context.editorCode || '(empty)',
  ].join('\n')
}

export function buildPromptMessages(request: ChatRequestBody): ProviderMessage[] {
  const trimmedHistory = request.messages.slice(-MAX_HISTORY_MESSAGES)

  return [
    {
      role: 'system',
      content: `${SYSTEM_PROMPT}\n\nCurrent challenge context:\n${buildContextBlock(request)}`,
    },
    ...trimmedHistory.map((message) => ({
      role: message.role,
      content: message.content.trim(),
    })),
  ]
}
