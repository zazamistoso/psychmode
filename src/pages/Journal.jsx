import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../supabase"
import { useAuth } from "../context/AuthContext"

export default function Journal() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [writing, setWriting] = useState(false)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const fetchEntries = async () => {
    const { data } = await supabase
      .from("journal_entries")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
    setEntries(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchEntries() }, [])

  const handleSave = async () => {
    if (!content.trim()) return
    setSaving(true)

    if (editingId) {
      await supabase
        .from("journal_entries")
        .update({ title, content, updated_at: new Date() })
        .eq("id", editingId)
    } else {
      await supabase
        .from("journal_entries")
        .insert({ user_id: user.id, title, content })
    }

    setTitle("")
    setContent("")
    setWriting(false)
    setEditingId(null)
    setSaving(false)
    fetchEntries()
  }

  const handleEdit = (entry) => {
    setTitle(entry.title || "")
    setContent(entry.content)
    setEditingId(entry.id)
    setWriting(true)
  }

  const handleDelete = async (id) => {
    if (!confirm("Delete this entry?")) return
    await supabase.from("journal_entries").delete().eq("id", id)
    fetchEntries()
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "long", day: "numeric", year: "numeric",
      hour: "2-digit", minute: "2-digit"
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">

      {/* Header */}
      <div className="bg-white shadow-sm px-6 py-4 flex items-center gap-3">
        <button onClick={() => navigate("/")} className="text-purple-600 hover:text-purple-800 text-xl">←</button>
        <h1 className="text-xl font-bold text-purple-700">My Journal 📓</h1>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">

        {/* New Entry Button */}
        {!writing && (
          <button
            onClick={() => { setWriting(true); setEditingId(null); setTitle(""); setContent("") }}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-2xl transition-all"
          >
            + New Entry
          </button>
        )}

        {/* Write / Edit Form */}
        {writing && (
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
            <h2 className="font-semibold text-gray-700">{editingId ? "Edit Entry" : "New Entry"}</h2>
            <input
              type="text"
              placeholder="Title (optional)"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <textarea
              placeholder="Write your thoughts..."
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={6}
              className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
            />
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={saving || !content.trim()}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-xl transition-all disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => { setWriting(false); setEditingId(null) }}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-2 rounded-xl transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Entries List */}
        {loading ? (
          <p className="text-center text-gray-400 py-8">Loading...</p>
        ) : entries.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-3">📝</div>
            <p className="text-gray-400">No entries yet. Write your first one!</p>
          </div>
        ) : (
          entries.map(entry => (
            <div key={entry.id} className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  {entry.title && <h3 className="font-semibold text-gray-800">{entry.title}</h3>}
                  <p className="text-xs text-gray-400">{formatDate(entry.created_at)}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(entry)}
                    className="text-xs text-purple-500 hover:text-purple-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="text-xs text-red-400 hover:text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600 whitespace-pre-wrap line-clamp-4">{entry.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}