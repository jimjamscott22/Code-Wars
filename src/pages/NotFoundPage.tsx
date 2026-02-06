import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="text-center py-16">
      <h2 className="text-4xl font-bold text-gray-800 mb-4">404</h2>
      <p className="text-gray-600 mb-6">Page not found.</p>
      <Link
        to="/"
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
      >
        Back to Home
      </Link>
    </div>
  )
}
