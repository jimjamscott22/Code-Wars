# Coding Challenges

A static React app for browsing and solving coding challenges in Python, JavaScript, and Java. Pick a language, explore challenges by category, and reveal solutions when you're ready.

## Features

- **3 languages** — Python, JavaScript, Java
- **12 challenges** across 5 categories (Basics, Strings, Hash Maps, Trees, Sorting)
- **Difficulty levels** — Beginner, Intermediate, Advanced
- **Solution reveal** — show/hide solution code per challenge
- **Coding Playground** — run JavaScript and Python code in-browser per challenge
- **Progress tracking** — mark challenges complete, persisted in localStorage
- **Category browsing** — challenges organized by topic with completion indicators

## Tech Stack

- React 19 + TypeScript
- Vite 7
- Tailwind CSS v4
- React Router v7
- Lucide React (icons)

## Getting Started

```bash
npm install
npm run dev
```

Opens at [http://localhost:5173](http://localhost:5173).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Project Structure

```
src/
  main.tsx              Entry point
  App.tsx               Router setup
  index.css             Tailwind import
  types.ts              Shared TypeScript types
  data/
    challenges.ts       All 12 challenges with solutions
  hooks/
    useProgress.ts      localStorage-backed progress tracking
  components/
    Layout.tsx           Header, breadcrumbs, language selector
    ChallengeDetail.tsx  Challenge view with solution toggle
    CodingPlayground.tsx In-browser code editor + runner
    ChallengeCard.tsx    Challenge list card
    CategoryCard.tsx     Category grid card
    DifficultyBadge.tsx  Colored difficulty pill
    ProgressBar.tsx      Visual progress bar
    LanguageSelector.tsx Language dropdown
    CompletionBanner.tsx Celebration banner
  pages/
    HomePage.tsx         Language selection
    CategoryListPage.tsx Category grid
    CategoryPage.tsx     Challenge list
    ChallengePage.tsx    Single challenge
    NotFoundPage.tsx     404
```

## Adding Challenges

Add a new entry to the `challenges` array in `src/data/challenges.ts`:

```ts
{
  id: 'your-challenge-id',
  title: 'Your Challenge Title',
  category: 'basics',        // basics | strings | hash-maps | trees | sorting
  difficulty: 'Beginner',    // Beginner | Intermediate | Advanced
  description: 'Challenge description here.',
  examples: ['example_func(input) → output'],
  solutions: {
    python: `def example_func(x):\n    return x`,
    javascript: `function exampleFunc(x) {\n    return x;\n}`,
    java: `public static int exampleFunc(int x) {\n    return x;\n}`,
  },
}
```

To add a new category, add it to the `Category` type and `CATEGORY_LABELS` / `CATEGORIES` in `src/types.ts`.
