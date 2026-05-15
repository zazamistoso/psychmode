import { useNavigate } from "react-router-dom"

const features = [
  {
    emoji: "📓",
    title: "Personal Journal",
    description: "Write freely. Your thoughts, your space. Add, edit, and delete entries anytime."
  },
  {
    emoji: "📊",
    title: "Mood Tracker",
    description: "Log how you feel daily and visualize your emotional patterns over time."
  },
  {
    emoji: "🔒",
    title: "Private & Secure",
    description: "Your entries are yours alone. Protected by secure authentication and row-level security."
  }
]

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">

      {/* Navbar */}
      <div className="flex items-center justify-between px-8 py-5">
        <h1 className="text-xl font-bold text-purple-700">PsychMode 🧠</h1>
        <button
          onClick={() => navigate("/login")}
          className="text-sm font-medium text-purple-600 hover:text-purple-800 transition-all"
        >
          Log In
        </button>
      </div>

      {/* Hero */}
      <div className="max-w-lg mx-auto px-6 pt-16 pb-12 text-center">
        <div className="text-7xl mb-6">🧠</div>
        <h2 className="text-4xl font-bold text-gray-800 mb-4 leading-tight">
          Your mental wellness,<br />
          <span className="text-purple-600">your journal.</span>
        </h2>
        <p className="text-gray-500 text-lg mb-10">
          PsychMode is a safe, private space to track your moods, write your thoughts, and understand yourself better — one day at a time.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate("/login", { state: { signup: true } })}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-3 rounded-xl transition-all hover:-translate-y-0.5 shadow-md"
          >
            Get Started
          </button>
          <button
            onClick={() => navigate("/login")}
            className="bg-white hover:bg-gray-50 text-purple-600 font-semibold px-8 py-3 rounded-xl transition-all hover:-translate-y-0.5 shadow-md border border-purple-100"
          >
            Log In
          </button>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-lg mx-auto px-6 pb-16 space-y-4">
        {features.map(feature => (
          <div key={feature.title} className="bg-white rounded-2xl shadow-sm p-6 flex gap-4 items-start">
            <div className="text-3xl">{feature.emoji}</div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">{feature.title}</h3>
              <p className="text-sm text-gray-500">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="text-center pb-8 text-xs text-gray-400">
        Made with 💜 by Zara Amistoso
      </div>

    </div>
  )
}