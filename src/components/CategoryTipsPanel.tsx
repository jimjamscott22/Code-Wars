import { useState } from 'react'
import { AlertTriangle, Lightbulb, Code2, ClipboardCopy, Check } from 'lucide-react'
import { CATEGORY_LABELS, LANGUAGE_LABELS } from '../types.ts'
import type { Category, Language } from '../types.ts'

const CATEGORY_TIPS: Record<Category, string[]> = {
  basics: [
    'Start with a tiny example and write expected output before coding.',
    'Break the task into steps: inputs, process, return value.',
    'Use loops for repeated work and keep conditions simple and explicit.',
    'For method or class tasks, define the class shape first, then add behavior one method at a time.',
  ],
  strings: [
    'Clarify edge cases first: empty strings, spaces, punctuation, and casing.',
    'Decide if your approach needs indexing, splitting, or frequency counting.',
    'Walk through one example character by character to verify logic.',
    'Prefer readable transformations before trying compact one-liners.',
  ],
  'hash-maps': [
    'Use a hash map when you need fast lookups, counts, or seen values.',
    'Define what keys and values represent before writing loops.',
    'Update map entries in one place to avoid off-by-one counting bugs.',
    'Check if you can solve in one pass by storing prior information.',
  ],
  trees: [
    'Decide between DFS (depth-first) and BFS (level-order) before coding.',
    'Write the base case first (usually when node is null).',
    'Sketch a small tree and trace recursion calls step by step.',
    'For recursive solutions, clearly define what each call returns.',
  ],
  sorting: [
    'Know the goal: in-place vs new array and ascending vs descending.',
    'Start with a straightforward approach, then optimize if needed.',
    'Trace a small unsorted array to confirm each pass improves order.',
    'Watch loop bounds carefully to avoid skipping the final comparisons.',
  ],
}

const CATEGORY_COMMON_MISTAKES: Record<Category, string[]> = {
  basics: [
    'Returning too early inside a loop before checking all items.',
    'Mixing up assignment and comparison in condition checks.',
    'Forgetting to update counters in loops, causing infinite loops.',
  ],
  strings: [
    'Not normalizing case or whitespace when the prompt expects it.',
    'Off-by-one index mistakes when slicing substrings.',
    'Ignoring empty-string inputs or one-character edge cases.',
  ],
  'hash-maps': [
    'Using the wrong key type or inconsistent key formatting.',
    'Reading a key before checking if it exists.',
    'Overwriting counts without incrementing existing values.',
  ],
  trees: [
    'Missing the null-node base case in recursive solutions.',
    'Mixing up preorder/inorder/postorder traversal order.',
    'Mutating shared node references unintentionally.',
  ],
  sorting: [
    'Incorrect loop bounds that skip comparisons at the end.',
    'Comparing wrong indexes during swaps.',
    'Assuming sorted input and skipping needed passes.',
  ],
}

interface Snippet {
  title: string
  code: string
}

const CATEGORY_SNIPPETS: Record<Category, Record<Language, Snippet>> = {
  basics: {
    python: {
      title: 'Function + conditional pattern',
      code: `def classify_number(n):
    if n > 0:
        return "positive"
    if n < 0:
        return "negative"
    return "zero"`,
    },
    javascript: {
      title: 'Function + loop pattern',
      code: `function sumPositives(nums) {
    let total = 0;
    for (const n of nums) {
        if (n > 0) total += n;
    }
    return total;
}`,
    },
    java: {
      title: 'Simple class with methods',
      code: `class Counter {
    private int value = 0;

    public void increment() { value++; }
    public void decrement() { value--; }
    public int getValue() { return value; }
}`,
    },
  },
  strings: {
    python: {
      title: 'Normalize then compare',
      code: `def is_palindrome(text):
    clean = ''.join(text.lower().split())
    return clean == clean[::-1]`,
    },
    javascript: {
      title: 'Split/transform/join flow',
      code: `function reverseWords(text) {
    return text.trim().split(/\\s+/).reverse().join(' ');
}`,
    },
    java: {
      title: 'String cleanup pattern',
      code: `public static String normalize(String text) {
    return text.toLowerCase().replaceAll("\\\\s+", "");
}`,
    },
  },
  'hash-maps': {
    python: {
      title: 'Dictionary frequency map',
      code: `def count_chars(text):
    counts = {}
    for ch in text:
        counts[ch] = counts.get(ch, 0) + 1
    return counts`,
    },
    javascript: {
      title: 'Map lookup + update',
      code: `function countItems(items) {
    const counts = new Map();
    for (const item of items) {
        counts.set(item, (counts.get(item) || 0) + 1);
    }
    return counts;
}`,
    },
    java: {
      title: 'How to use a HashMap in Java',
      code: `Map<String, Integer> counts = new HashMap<>();
for (String word : words) {
    counts.put(word, counts.getOrDefault(word, 0) + 1);
}

if (counts.containsKey("apple")) {
    int value = counts.get("apple");
}`,
    },
  },
  trees: {
    python: {
      title: 'Recursive tree base case',
      code: `def max_depth(node):
    if not node:
        return 0
    return 1 + max(max_depth(node.left), max_depth(node.right))`,
    },
    javascript: {
      title: 'DFS recursion pattern',
      code: `function maxDepth(node) {
    if (!node) return 0;
    return 1 + Math.max(maxDepth(node.left), maxDepth(node.right));
}`,
    },
    java: {
      title: 'Tree recursion in Java',
      code: `public static int maxDepth(TreeNode node) {
    if (node == null) return 0;
    return 1 + Math.max(maxDepth(node.left), maxDepth(node.right));
}`,
    },
  },
  sorting: {
    python: {
      title: 'Basic bubble sort loop',
      code: `def bubble_sort(nums):
    arr = nums[:]
    for i in range(len(arr)):
        for j in range(0, len(arr) - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr`,
    },
    javascript: {
      title: 'Swap with destructuring',
      code: `function bubbleSort(nums) {
    const arr = [...nums];
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
    return arr;
}`,
    },
    java: {
      title: 'Classic swap pattern',
      code: `for (int i = 0; i < arr.length; i++) {
    for (int j = 0; j < arr.length - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
            int tmp = arr[j];
            arr[j] = arr[j + 1];
            arr[j + 1] = tmp;
        }
    }
}`,
    },
  },
}

interface CategoryTipsPanelProps {
  category: Category
  language: Language
}

export default function CategoryTipsPanel({ category, language }: CategoryTipsPanelProps) {
  const [copied, setCopied] = useState(false)
  const tips = CATEGORY_TIPS[category]
  const commonMistakes = CATEGORY_COMMON_MISTAKES[category]
  const snippet = CATEGORY_SNIPPETS[category][language]

  const handleCopySnippet = async () => {
    try {
      await navigator.clipboard.writeText(snippet.code)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1400)
    } catch {
      // Ignore clipboard failures in unsupported browser contexts.
    }
  }

  return (
    <aside className="rounded-2xl border border-amber-200/80 bg-amber-50/70 p-4 sm:p-5 space-y-5">
      <div className="flex items-center gap-2 text-amber-900 mb-2">
        <Lightbulb size={18} />
        <h3 className="text-sm font-semibold uppercase tracking-wide">Approach Tips</h3>
      </div>
      <p className="text-sm text-amber-900/80 mb-3">
        {CATEGORY_LABELS[category]} challenges
      </p>
      <ul className="space-y-2 text-sm text-amber-950/90">
        {tips.map((tip) => (
          <li key={tip} className="flex gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-600 shrink-0" />
            <span>{tip}</span>
          </li>
        ))}
      </ul>

      <div className="border-t border-amber-200/80 pt-4">
        <div className="flex items-center gap-2 text-amber-900 mb-2">
          <AlertTriangle size={16} />
          <h4 className="text-xs font-semibold uppercase tracking-wide">Common mistakes</h4>
        </div>
        <ul className="space-y-2 text-sm text-amber-950/90">
          {commonMistakes.map((mistake) => (
            <li key={mistake} className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-700 shrink-0" />
              <span>{mistake}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-amber-200/80 pt-4">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 text-amber-900">
            <Code2 size={16} />
            <h4 className="text-xs font-semibold uppercase tracking-wide">Snippet example</h4>
          </div>
          <button
            type="button"
            onClick={handleCopySnippet}
            className="inline-flex items-center gap-1.5 text-xs text-amber-950 border border-amber-300 rounded-md px-2 py-1 hover:bg-amber-100 transition-colors"
          >
            {copied ? <Check size={14} /> : <ClipboardCopy size={14} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
        <p className="text-xs text-amber-900/80 mb-2">
          {snippet.title} ({LANGUAGE_LABELS[language]})
        </p>
        <pre className="rounded-lg bg-amber-950 text-amber-50 p-3 text-xs overflow-x-auto">
          <code>{snippet.code}</code>
        </pre>
      </div>
    </aside>
  )
}
