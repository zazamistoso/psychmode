import { useState } from "react"
import { supabase } from "../supabase"

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleSubmit = async () => {
    setError("")
    setMessage("")
    setLoading(true)

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setError(error.message)
      else setMessage("Check your email for a confirmation link!")
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">

        {/* Logo / Title */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🧠</div>
          <h1 className="text-3xl font-bold text-purple-700">PsychMode</h1>
          <p className="text-gray-500 mt-1">Your personal mental wellness journal</p>
        </div>

        {/* Toggle */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          <button
            onClick={() => setIsSignUp(false)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${!isSignUp ? "bg-white shadow text-purple-700" : "text-gray-500"}`}
          >
            Log In
          </button>
          <button
            onClick={() => setIsSignUp(true)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${isSignUp ? "bg-white shadow text-purple-700" : "text-gray-500"}`}
          >
            Sign Up
          </button>
        </div>

        {/* Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
        </div>

        {/* Error / Message */}
        {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
        {message && <p className="text-green-500 text-sm mt-4 text-center">{message}</p>}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50"
        >
          {loading ? "Please wait..." : isSignUp ? "Create Account" : "Log In"}
        </button>

      </div>
    </div>
  )
}