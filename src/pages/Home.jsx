import { useAuth } from "../context/AuthContext"
import { supabase } from "../supabase"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

const moods = [
  { emoji: "😄", label: "Great" },
  { emoji: "🙂", label: "Good" },
  { emoji: "😐", label: "Okay" },
  { emoji: "😔", label: "Low" },
  { emoji: "😢", label: "Awful" },
]

export default function Home() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [selectedMood, setSelectedMood] = useState(null)
  const [moodSaved, setMoodSaved] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .single()
      if (data?.username) setUsername(data.username)
    }
    fetchProfile()
  }, [user])

  const handleMood = async (mood) => {
    setSelectedMood(mood.label)
    await supabase.from("mood_logs").insert({
      user_id: user.id,
      mood: mood.label,
    })
    setMoodSaved(true)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate("/login")
  }

  const firstName = username?.split("@")[0] || "there"

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">

      {/* Header */}
      <div className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-purple-700">PsychMode 🧠</h1>
          <p className="text-sm text-gray-500">Hi, {firstName}!</p>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-500 hover:text-red-500 transition-all"
        >
          Log out
        </button>
      </div>

      <div className="max-w-lg mx-auto px-4 py-8 space-y-6">

        {/* Mood Check-in */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-1">How are you feeling today?</h2>
          <p className="text-sm text-gray-400 mb-4">Tap a mood to log it</p>
          <div className="flex justify-between">
            {moods.map((mood) => (
              <button
                key={mood.label}
                onClick={() => handleMood(mood)}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
                  selectedMood === mood.label
                    ? "bg-purple-100 scale-110"
                    : "hover:bg-gray-50"
                }`}
              >
                <span className="text-3xl">{mood.emoji}</span>
                <span className="text-xs text-gray-500">{mood.label}</span>
              </button>
            ))}
          </div>
          {moodSaved && (
            <p className="text-center text-green-500 text-sm mt-3">
              Mood logged! ✓
            </p>
          )}
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => navigate("/journal")}
            className="bg-white rounded-2xl shadow-sm p-6 text-left hover:shadow-md transition-all hover:-translate-y-1"
          >
            <div className="text-3xl mb-3">📓</div>
            <h3 className="font-semibold text-gray-800">Journal</h3>
            <p className="text-xs text-gray-400 mt-1">Write your thoughts</p>
          </button>

          <button
            onClick={() => navigate("/mood")}
            className="bg-white rounded-2xl shadow-sm p-6 text-left hover:shadow-md transition-all hover:-translate-y-1"
          >
            <div className="text-3xl mb-3">📊</div>
            <h3 className="font-semibold text-gray-800">Mood Tracker</h3>
            <p className="text-xs text-gray-400 mt-1">View your history</p>
          </button>

          <button
            onClick={() => navigate("/profile")}
            className="bg-white rounded-2xl shadow-sm p-6 text-left hover:shadow-md transition-all hover:-translate-y-1 col-span-2"
          >
            <div className="text-3xl mb-3">👤</div>
            <h3 className="font-semibold text-gray-800">Profile</h3>
            <p className="text-xs text-gray-400 mt-1">Edit your details</p>
          </button>
        </div>

      </div>
    </div>
  )
}