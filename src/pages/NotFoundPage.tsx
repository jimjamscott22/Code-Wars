import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="text-center py-16 rounded-2xl border border-slate-200 bg-white/85">
      <h2 className="text-4xl font-bold text-slate-900 mb-4">404</h2>
      <p className="text-slate-600 mb-6">Page not found.</p>
      <Link
        to="/"
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
      >
        Back to Home
      </Link>
    </div>
  )
}
