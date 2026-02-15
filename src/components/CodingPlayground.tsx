import { useEffect, useMemo, useState } from 'react'
import { Play, RotateCcw, LoaderCircle, Terminal } from 'lucide-react'
import type { Language } from '../types.ts'

interface CodingPlaygroundProps {
  language: Language
  starterCode: string
}

interface PyodideLike {
  runPythonAsync: (code: string) => Promise<unknown>
  setStdout: (options: { batched: (text: string) => void }) => void
  setStderr: (options: { batched: (text: string) => void }) => void
}

declare global {
  interface Window {
    loadPyodide?: (options: { indexURL: string }) => Promise<PyodideLike>
  }
}

const PYODIDE_VERSION = '0.26.4'
const PYODIDE_BASE_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full`

let pyodidePromise: Promise<PyodideLike> | null = null

async function loadPyodideRuntime(): Promise<PyodideLike> {
  if (pyodidePromise) {
    return pyodidePromise
  }

  pyodidePromise = new Promise<PyodideLike>((resolve, reject) => {
    const attachRuntime = async () => {
      try {
        if (!window.loadPyodide) {
          throw new Error('Python runtime is unavailable in this browser.')
        }
        const pyodide = await window.loadPyodide({ indexURL: `${PYODIDE_BASE_URL}/` })
        resolve(pyodide)
      } catch (error) {
        reject(error)
      }
    }

    if (window.loadPyodide) {
      void attachRuntime()
      return
    }

    const existingScript = document.querySelector<HTMLScriptElement>('script[data-pyodide-loader="true"]')
    if (existingScript) {
      existingScript.addEventListener('load', () => void attachRuntime(), { once: true })
      existingScript.addEventListener('error', () => reject(new Error('Failed to load Python runtime.')), { once: true })
      return
    }

    const script = document.createElement('script')
    script.src = `${PYODIDE_BASE_URL}/pyodide.js`
    script.async = true
    script.dataset.pyodideLoader = 'true'
    script.addEventListener('load', () => void attachRuntime(), { once: true })
    script.addEventListener('error', () => reject(new Error('Failed to load Python runtime.')), { once: true })
    document.head.appendChild(script)
  })

  return pyodidePromise
}

function formatRuntimeValue(value: unknown): string | null {
  if (value === undefined || value === null) {
    return null
  }

  if (typeof value === 'string') {
    return value
  }

  try {
    return JSON.stringify(value, null, 2)
  } catch {
    return String(value)
  }
}

export default function CodingPlayground({ language, starterCode }: CodingPlaygroundProps) {
  const [code, setCode] = useState(starterCode)
  const [output, setOutput] = useState('Run code to see output.')
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    setCode(starterCode)
    setOutput('Run code to see output.')
  }, [language, starterCode])

  const languageLabel = useMemo(() => {
    if (language === 'python') {
      return 'Python'
    }
    if (language === 'javascript') {
      return 'JavaScript'
    }
    return 'Java'
  }, [language])

  const runJavaScript = () => {
    const logs: string[] = []
    const originalLog = console.log

    console.log = (...args: unknown[]) => {
      logs.push(args.map(arg => formatRuntimeValue(arg) ?? 'undefined').join(' '))
    }

    try {
      const result = Function(`"use strict";\n${code}`)()
      const resultText = formatRuntimeValue(result)
      const outputBlocks = [...logs]

      if (resultText !== null) {
        outputBlocks.push(`Return value:\n${resultText}`)
      }
      if (outputBlocks.length === 0) {
        outputBlocks.push('Executed successfully.')
      }

      setOutput(outputBlocks.join('\n\n'))
    } catch (error) {
      setOutput(`Error:\n${error instanceof Error ? error.message : String(error)}`)
    } finally {
      console.log = originalLog
    }
  }

  const runPython = async () => {
    const stdout: string[] = []
    const stderr: string[] = []

    try {
      const pyodide = await loadPyodideRuntime()
      pyodide.setStdout({
        batched: text => {
          if (text.trim()) {
            stdout.push(text)
          }
        },
      })
      pyodide.setStderr({
        batched: text => {
          if (text.trim()) {
            stderr.push(text)
          }
        },
      })

      const result = await pyodide.runPythonAsync(code)
      const resultText = formatRuntimeValue(result)
      const outputBlocks = [...stdout]

      if (stderr.length > 0) {
        outputBlocks.push(`stderr:\n${stderr.join('\n')}`)
      }
      if (resultText !== null) {
        outputBlocks.push(`Return value:\n${resultText}`)
      }
      if (outputBlocks.length === 0) {
        outputBlocks.push('Executed successfully.')
      }

      setOutput(outputBlocks.join('\n\n'))
    } catch (error) {
      setOutput(`Error:\n${error instanceof Error ? error.message : String(error)}`)
    }
  }

  const handleRun = async () => {
    if (language === 'java') {
      setOutput('Java execution is not enabled in-browser yet. Use Python or JavaScript for live runs.')
      return
    }

    setIsRunning(true)
    setOutput('Running...')
    try {
      if (language === 'python') {
        await runPython()
      } else {
        runJavaScript()
      }
    } finally {
      setIsRunning(false)
    }
  }

  const handleReset = () => {
    setCode(starterCode)
    setOutput('Starter code restored.')
  }

  return (
    <section className="mt-6 rounded-2xl border border-indigo-200 bg-indigo-50/60 p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Coding Playground</h3>
          <p className="text-sm text-slate-600">
            Experiment with your solution in {languageLabel}. Use <span className="font-mono">console.log(...)</span> or{' '}
            <span className="font-mono">print(...)</span> to inspect values.
          </p>
        </div>
        <div className="inline-flex items-center rounded-full bg-white border border-indigo-200 px-3 py-1 text-xs font-medium text-indigo-700">
          <Terminal size={14} className="mr-1.5" />
          In-browser runtime
        </div>
      </div>

      <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Editor</label>
      <textarea
        value={code}
        onChange={event => setCode(event.target.value)}
        className="w-full min-h-72 rounded-xl border border-slate-300 bg-slate-950 text-slate-100 p-4 font-mono text-sm leading-6 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        spellCheck={false}
      />

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => void handleRun()}
          disabled={isRunning}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isRunning ? <LoaderCircle size={16} className="animate-spin" /> : <Play size={16} />}
          {isRunning ? 'Running' : 'Run Code'}
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <RotateCcw size={16} />
          Reset
        </button>
      </div>

      <div className="mt-4">
        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Output</label>
        <pre className="min-h-28 rounded-xl border border-slate-300 bg-slate-900 p-4 text-sm text-slate-100 whitespace-pre-wrap break-words">
          {output}
        </pre>
      </div>
    </section>
  )
}
