import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../supabase"
import { useAuth } from "../context/AuthContext"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"

const moodScore = { Great: 5, Good: 4, Okay: 3, Low: 2, Awful: 1 }
const moodEmoji = { Great: "😄", Good: "🙂", Okay: "😐", Low: "😔", Awful: "😢" }
const moodColor = { Great: "#a855f7", Good: "#818cf8", Okay: "#60a5fa", Low: "#94a3b8", Awful: "#f87171" }

export default function MoodTracker() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLogs = async () => {
      const { data } = await supabase
        .from("mood_logs")
        .select("*")
        .eq("user_id", user.id)
        .order("logged_at", { ascending: false })
        .limit(30)
      setLogs(data || [])
      setLoading(false)
    }
    fetchLogs()
  }, [])

  const chartData = [...logs]
    .reverse()
    .slice(-7)
    .map(log => ({
      date: new Date(log.logged_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      score: moodScore[log.mood] || 3,
      mood: log.mood,
    }))

  const average = logs.length
    ? (logs.reduce((sum, l) => sum + (moodScore[l.mood] || 3), 0) / logs.length).toFixed(1)
    : null

  const getMoodFromScore = (score) => {
    return Object.entries(moodScore).find(([, v]) => v === Math.round(score))?.[0] || "Okay"
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
        <h1 className="text-xl font-bold text-purple-700">Mood Tracker 📊</h1>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">

        {/* Average Mood Card */}
        {average && (
          <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
            <p className="text-sm text-gray-400 mb-1">Your average mood (last {logs.length} logs)</p>
            <div className="text-5xl mb-2">{moodEmoji[getMoodFromScore(average)]}</div>
            <p className="text-2xl font-bold text-purple-700">{getMoodFromScore(average)}</p>
            <p className="text-sm text-gray-400">Score: {average} / 5</p>
          </div>
        )}

        {/* Chart */}
        {chartData.length > 1 && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="font-semibold text-gray-700 mb-4">Last 7 mood logs</h2>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartData}>
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 5]} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(value, name, props) => [props.payload.mood, "Mood"]}
                />
                <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={moodColor[entry.mood] || "#a855f7"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Log History */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-semibold text-gray-700 mb-4">Mood History</h2>
          {loading ? (
            <p className="text-center text-gray-400">Loading...</p>
          ) : logs.length === 0 ? (
            <div className="text-center py-6">
              <div className="text-4xl mb-2">📭</div>
              <p className="text-gray-400 text-sm">No moods logged yet. Go to the home page to log one!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {logs.map(log => (
                <div key={log.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{moodEmoji[log.mood]}</span>
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{log.mood}</p>
                      <p className="text-xs text-gray-400">{formatDate(log.logged_at)}</p>
                    </div>
                  </div>
                  <div
                    className="w-2 h-8 rounded-full"
                    style={{ backgroundColor: moodColor[log.mood] }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}