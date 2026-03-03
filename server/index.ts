import express from 'express'
import { fileURLToPath } from 'node:url'
import { z, ZodError } from 'zod'
import { getConfig, type ChatServerConfig } from './config.ts'
import { buildPromptMessages } from './prompt/buildPrompt.ts'
import { createLmStudioProvider } from './providers/lmStudioProvider.ts'
import { ProviderError, isAbortError } from './providers/base.ts'
import type { ChatProvider } from './providers/base.ts'
import { createOllamaProvider } from './providers/ollamaProvider.ts'
import type { ChatRequestBody } from './types.ts'

const requestBodySchema = z.object({
  context: z.object({
    challengeId: z.string().trim().min(1).max(120),
    title: z.string().trim().min(1).max(160),
    category: z.string().trim().min(1).max(80),
    language: z.string().trim().min(1).max(40),
    description: z.string().trim().min(1).max(2_000),
    examples: z.array(z.string().trim().min(1).max(300)).max(8),
    editorCode: z.string().max(10_000),
  }),
  messages: z.array(z.object({
    id: z.string().trim().min(1).max(120),
    role: z.enum(['user', 'assistant']),
    content: z.string().trim().min(1).max(2_000),
    createdAt: z.number().int().nonnegative(),
  })).min(1).max(10),
}).refine((value) => value.messages.at(-1)?.role === 'user', {
  message: 'The final message in the request must come from the user.',
  path: ['messages'],
})

function createProvider(config: ChatServerConfig): ChatProvider {
  return config.provider === 'lm-studio'
    ? createLmStudioProvider(config.lmStudioBaseUrl)
    : createOllamaProvider(config.ollamaBaseUrl)
}

function sendError(
  res: express.Response,
  status: number,
  code: 'VALIDATION_ERROR' | 'UPSTREAM_UNAVAILABLE' | 'UPSTREAM_BAD_RESPONSE' | 'REQUEST_TIMEOUT',
  message: string,
) {
  res.status(status).json({
    error: {
      code,
      message,
    },
  })
}

function createTimeoutSignal(timeoutMs: number): { cancel: () => void, signal: AbortSignal } {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  return {
    cancel: () => clearTimeout(timeoutId),
    signal: controller.signal,
  }
}

function createAssistantMessage(content: string) {
  return {
    id: `assistant-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role: 'assistant' as const,
    content,
    createdAt: Date.now(),
  }
}

export function createApp(config: ChatServerConfig = getConfig()) {
  const app = express()
  const provider = createProvider(config)

  app.use(express.json({ limit: '64kb' }))

  app.get('/api/chat/health', async (_req, res) => {
    const timeout = createTimeoutSignal(Math.min(config.requestTimeoutMs, 5_000))

    try {
      const health = await provider.checkHealth(timeout.signal)
      res.status(health.reachable ? 200 : 503).json({
        provider: provider.name,
        model: config.chatModel,
        reachable: health.reachable,
        detail: health.detail ?? null,
      })
    } finally {
      timeout.cancel()
    }
  })

  app.post('/api/chat', async (req, res) => {
    let parsedBody: ChatRequestBody

    try {
      parsedBody = requestBodySchema.parse(req.body)
    } catch (error) {
      if (error instanceof ZodError) {
        const issue = error.issues[0]
        sendError(res, 400, 'VALIDATION_ERROR', issue?.message ?? 'The chat request is invalid.')
        return
      }

      sendError(res, 400, 'VALIDATION_ERROR', 'The chat request is invalid.')
      return
    }

    const timeout = createTimeoutSignal(config.requestTimeoutMs)

    try {
      const result = await provider.sendChat({
        messages: buildPromptMessages(parsedBody),
        model: config.chatModel,
        signal: timeout.signal,
      })

      res.json({
        message: createAssistantMessage(result.content),
        provider: provider.name,
        model: config.chatModel,
      })
    } catch (error) {
      if (error instanceof ProviderError) {
        sendError(res, error.status, error.code, error.message)
        return
      }

      if (isAbortError(error)) {
        sendError(res, 504, 'REQUEST_TIMEOUT', 'The chat request timed out before the local model responded.')
        return
      }

      sendError(res, 502, 'UPSTREAM_BAD_RESPONSE', 'The local model returned an unexpected response.')
    } finally {
      timeout.cancel()
    }
  })

  app.use((error: unknown, _req: express.Request, res: express.Response, next: express.NextFunction) => {
    void next

    if (error instanceof SyntaxError) {
      sendError(res, 400, 'VALIDATION_ERROR', 'Request JSON is malformed.')
      return
    }

    sendError(res, 500, 'UPSTREAM_BAD_RESPONSE', 'The local chat server encountered an unexpected error.')
  })

  return { app, config, provider }
}

export function startServer(config: ChatServerConfig = getConfig()) {
  const { app } = createApp(config)

  app.listen(config.port, () => {
    console.log(`Local chat server listening on http://localhost:${config.port}`)
  })
}

const isMainModule = process.argv[1] === fileURLToPath(import.meta.url)

if (isMainModule) {
  startServer()
}
