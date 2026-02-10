import { Trophy } from 'lucide-react'

export default function CompletionBanner() {
  return (
    <div className="bg-gradient-to-r from-emerald-500 to-indigo-500 text-white p-6 rounded-2xl shadow-lg mt-6 text-center">
      <Trophy className="mx-auto mb-2" size={48} />
      <h2 className="text-2xl font-bold mb-2">Congratulations!</h2>
      <p>You've completed all challenges! You're a coding champion.</p>
    </div>
  )
}
