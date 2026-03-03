import { useState } from 'react'
import type { FormEvent } from 'react'
import { Bot, LoaderCircle, MessageSquarePlus, Send, Sparkles, Trash2 } from 'lucide-react'
import useChallengeChat from '../hooks/useChallengeChat.ts'
import type { ChallengeChatContext } from '../types.ts'

const QUICK_PROMPTS = [
  "What's the first step?",
  'Can you explain this error?',
  'What edge cases should I test?',
  'Give me a hint, not the full answer',
]

interface ChallengeChatPanelProps {
  context: ChallengeChatContext
}

function formatTimestamp(timestamp: number): string {
  return new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  }).format(timestamp)
}

export default function ChallengeChatPanel({ context }: ChallengeChatPanelProps) {
  const { error, isLoading, messages, clearChat, sendMessage } = useChallengeChat(context)
  const [draft, setDraft] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const wasSent = await sendMessage(draft)
    if (wasSent) {
      setDraft('')
    }
  }

  return (
    <aside className="rounded-2xl border border-sky-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sky-800">
            <Sparkles size={14} />
            Tutor mode
          </div>
          <h3 className="mt-3 text-lg font-semibold text-slate-900">Ask for a Hint</h3>
          <p className="mt-1 text-sm text-slate-600">
            Get short, challenge-aware guidance based on your current {context.language} code. The tutor starts with hints instead of full solutions.
          </p>
        </div>
        {messages.length > 0 && (
          <button
            type="button"
            onClick={clearChat}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
          >
            <Trash2 size={14} />
            Clear chat
          </button>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {QUICK_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            disabled={isLoading}
            onClick={() => setDraft(prompt)}
            className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-medium text-sky-800 transition-colors hover:bg-sky-100 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <MessageSquarePlus size={12} />
            {prompt}
          </button>
        ))}
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
          {error}
        </div>
      )}

      <div className="mt-4 max-h-80 space-y-3 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-3">
        {messages.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white px-3 py-4 text-sm text-slate-500">
            Ask about the current prompt, test cases, logic, or why your latest edit is failing. The tutor will use this challenge and your editor content as context.
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`rounded-xl px-3 py-2 ${
                message.role === 'assistant'
                  ? 'border border-sky-100 bg-white'
                  : 'bg-slate-900 text-slate-100'
              }`}
            >
              <div className="mb-1 flex items-center justify-between gap-3 text-[11px] uppercase tracking-wide">
                <span className={`inline-flex items-center gap-1.5 font-semibold ${message.role === 'assistant' ? 'text-sky-700' : 'text-slate-300'}`}>
                  {message.role === 'assistant' ? <Bot size={12} /> : <Send size={12} />}
                  {message.role === 'assistant' ? 'Tutor' : 'You'}
                </span>
                <span className={message.role === 'assistant' ? 'text-slate-400' : 'text-slate-400'}>
                  {formatTimestamp(message.createdAt)}
                </span>
              </div>
              <p className={`whitespace-pre-wrap text-sm ${message.role === 'assistant' ? 'text-slate-700' : 'text-slate-100'}`}>
                {message.content}
              </p>
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex items-center gap-2 rounded-xl border border-sky-100 bg-white px-3 py-2 text-sm text-slate-600">
            <LoaderCircle size={14} className="animate-spin text-sky-600" />
            Thinking through your current approach...
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-4">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
          Your question
        </label>
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Ask for a hint, explain an error, or request edge cases to test."
          className="min-h-28 w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-400"
          disabled={isLoading}
        />
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            Full solutions are intentionally de-emphasized on the first response.
          </p>
          <button
            type="submit"
            disabled={isLoading || !draft.trim()}
            className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? <LoaderCircle size={16} className="animate-spin" /> : <Send size={16} />}
            {isLoading ? 'Sending' : 'Send'}
          </button>
        </div>
      </form>
    </aside>
  )
}
