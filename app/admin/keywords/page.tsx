"use client"

import { useState, useEffect } from "react"

interface KeywordList {
  whitelist: string[]
  blacklist: string[]
}

export default function KeywordsManagement() {
  const [keywords, setKeywords] = useState<KeywordList>({
    whitelist: [],
    blacklist: [],
  })
  const [newKeyword, setNewKeyword] = useState("")
  const [activeTab, setActiveTab] = useState<"whitelist" | "blacklist">("whitelist")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchKeywords()
  }, [])

  const fetchKeywords = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/keywords")
      if (response.ok) {
        const data = await response.json()
        setKeywords(data)
      }
    } catch (error) {
      console.error("Failed to fetch keywords:", error)
    } finally {
      setLoading(false)
    }
  }

  const saveKeywords = async () => {
    try {
      setSaving(true)
      const response = await fetch("/api/admin/keywords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(keywords),
      })

      if (response.ok) {
        alert("Keywords saved successfully!")
      } else {
        alert("Failed to save keywords")
      }
    } catch (error) {
      console.error("Failed to save keywords:", error)
      alert("Failed to save keywords")
    } finally {
      setSaving(false)
    }
  }

  const syncToWolfStudio = async () => {
    try {
      setSaving(true)
      const response = await fetch("/api/admin/keywords/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(keywords),
      })

      if (response.ok) {
        alert("Keywords synced to Wolf Development Studio successfully!")
      } else {
        alert("Failed to sync keywords to Wolf Development Studio")
      }
    } catch (error) {
      console.error("Failed to sync keywords:", error)
      alert("Failed to sync keywords")
    } finally {
      setSaving(false)
    }
  }

  const addKeyword = () => {
    if (!newKeyword.trim()) return

    const keyword = newKeyword.trim().toLowerCase()
    const list = activeTab === "whitelist" ? "whitelist" : "blacklist"

    if (!keywords[list].includes(keyword)) {
      setKeywords({
        ...keywords,
        [list]: [...keywords[list], keyword],
      })
    }

    setNewKeyword("")
  }

  const removeKeyword = (keyword: string, list: "whitelist" | "blacklist") => {
    setKeywords({
      ...keywords,
      [list]: keywords[list].filter((k) => k !== keyword),
    })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addKeyword()
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading keywords...</div>
      </div>
    )
  }

  const currentList = keywords[activeTab]

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Keyword Management</h1>
        <p className="mt-2 text-sm text-gray-600">
          Control which keywords you want to see or filter out from Wolf Development Studio
        </p>
      </div>

      {/* Info Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-green-900 mb-1">Whitelist</h3>
          <p className="text-xs text-green-700">
            Articles containing these keywords will be prioritized and featured
          </p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-red-900 mb-1">Blacklist</h3>
          <p className="text-xs text-red-700">
            Articles containing these keywords will be filtered out and hidden
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("whitelist")}
              className={`${
                activeTab === "whitelist"
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
            >
              Whitelist ({keywords.whitelist.length})
            </button>
            <button
              onClick={() => setActiveTab("blacklist")}
              className={`${
                activeTab === "blacklist"
                  ? "border-red-500 text-red-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
            >
              Blacklist ({keywords.blacklist.length})
            </button>
          </nav>
        </div>
      </div>

      {/* Add Keyword */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Add to {activeTab === "whitelist" ? "Whitelist" : "Blacklist"}
        </h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter keyword..."
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <button
            onClick={addKeyword}
            className={`px-4 py-2 rounded-md text-white font-medium ${
              activeTab === "whitelist"
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            Add
          </button>
        </div>
      </div>

      {/* Keywords List */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          {activeTab === "whitelist" ? "Whitelisted" : "Blacklisted"} Keywords
        </h2>
        {currentList.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-8">
            No keywords in this list yet
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {currentList.map((keyword) => (
              <div
                key={keyword}
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                  activeTab === "whitelist"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                <span>{keyword}</span>
                <button
                  onClick={() => removeKeyword(keyword, activeTab)}
                  className="hover:opacity-70"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={saveKeywords}
          disabled={saving}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {saving ? "Saving..." : "Save Keywords"}
        </button>
        <button
          onClick={syncToWolfStudio}
          disabled={saving}
          className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {saving ? "Syncing..." : "Sync to Wolf Development Studio"}
        </button>
      </div>

      <p className="mt-4 text-xs text-gray-500">
        Note: Keywords are case-insensitive. Saving will store locally, and syncing will send to Wolf Development Studio API.
      </p>
    </div>
  )
}
