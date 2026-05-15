import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../supabase"
import { useAuth } from "../context/AuthContext"

export default function Profile() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

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

  const handleSaveProfile = async () => {
    setError("")
    setMessage("")
    setSaving(true)
    const { error } = await supabase
      .from("profiles")
      .update({ username })
      .eq("id", user.id)
    if (error) setError(error.message)
    else setMessage("Profile updated!")
    setSaving(false)
  }

  const handleChangePassword = async () => {
    setError("")
    setMessage("")
    if (newPassword !== confirmPassword) {
      setError("Passwords don't match!")
      return
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }
    setSaving(true)
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) setError(error.message)
    else {
      setMessage("Password changed successfully!")
      setNewPassword("")
      setConfirmPassword("")
    }
    setSaving(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate("/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">

      {/* Header */}
      <div className="bg-white shadow-sm px-6 py-4 flex items-center gap-3">
        <button onClick={() => navigate("/")} className="text-purple-600 hover:text-purple-800 text-xl">←</button>
        <h1 className="text-xl font-bold text-purple-700">Profile 👤</h1>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">

        {/* Avatar + Email */}
        <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
          <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center text-4xl mx-auto mb-3">
            {username?.[0]?.toUpperCase() || "?"}
          </div>
          <p className="text-gray-500 text-sm">{user.email}</p>
          <p className="text-xs text-gray-400 mt-1">
            Member since {new Date(user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </p>
        </div>

        {/* Edit Username */}
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-gray-700">Edit Display Name</h2>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Your name"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Name"}
          </button>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-gray-700">Change Password</h2>
          <input
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            placeholder="New password"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <button
            onClick={handleChangePassword}
            disabled={saving}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50"
          >
            {saving ? "Saving..." : "Change Password"}
          </button>
        </div>

        {/* Feedback */}
        {message && <p className="text-center text-green-500 text-sm">{message}</p>}
        {error && <p className="text-center text-red-500 text-sm">{error}</p>}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-50 hover:bg-red-100 text-red-500 font-semibold py-3 rounded-xl transition-all"
        >
          Log Out
        </button>

      </div>
    </div>
  )
}