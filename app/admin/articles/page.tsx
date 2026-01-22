"use client"

import { useState, useEffect } from "react"

// Admin Article type - matches Wolf Studio API response
interface Article {
  id: string
  title: string
  excerpt: string
  url: string
  image_url?: string
  source_name: string
  category: string
  tags: string[]
  published_at: string
  view_count: number
}

export default function ArticlesManagement() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [hiddenArticles, setHiddenArticles] = useState<Set<string>>(new Set())
  const [filter, setFilter] = useState<"all" | "visible" | "hidden">("all")

  useEffect(() => {
    fetchArticles()
    loadHiddenArticles()
  }, [])

  const fetchArticles = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles/list?limit=100`)
      const data = await response.json()

      // Sort articles by published date (newest first)
      const sortedArticles = (data.articles || []).sort((a: Article, b: Article) => {
        return new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
      })

      setArticles(sortedArticles)
    } catch (error) {
      console.error("Failed to fetch articles:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadHiddenArticles = () => {
    const stored = localStorage.getItem("hiddenArticles")
    if (stored) {
      setHiddenArticles(new Set(JSON.parse(stored)))
    }
  }

  const toggleArticleVisibility = async (articleId: string) => {
    const newHidden = new Set(hiddenArticles)

    if (newHidden.has(articleId)) {
      newHidden.delete(articleId)
    } else {
      newHidden.add(articleId)
    }

    setHiddenArticles(newHidden)
    localStorage.setItem("hiddenArticles", JSON.stringify(Array.from(newHidden)))

    // Send to backend API to persist
    try {
      await fetch("/api/admin/articles/hide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          articleId,
          hidden: newHidden.has(articleId),
        }),
      })
    } catch (error) {
      console.error("Failed to update article visibility:", error)
    }
  }

  const filteredArticles = articles.filter((article) => {
    if (filter === "visible") return !hiddenArticles.has(article.id)
    if (filter === "hidden") return hiddenArticles.has(article.id)
    return true
  })

  const formatDate = (dateString: string) => {
    if (!dateString) return "No date"
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return "Invalid date"
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch {
      return "Invalid date"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading articles...</div>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Article Management</h1>
        <p className="mt-2 text-sm text-gray-600">
          Review and manage articles from Wolf Development Studio
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6">
        <div className="sm:hidden">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="all">All Articles ({articles.length})</option>
            <option value="visible">
              Visible ({articles.length - hiddenArticles.size})
            </option>
            <option value="hidden">Hidden ({hiddenArticles.size})</option>
          </select>
        </div>
        <div className="hidden sm:block">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setFilter("all")}
                className={`${
                  filter === "all"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
              >
                All Articles ({articles.length})
              </button>
              <button
                onClick={() => setFilter("visible")}
                className={`${
                  filter === "visible"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
              >
                Visible ({articles.length - hiddenArticles.size})
              </button>
              <button
                onClick={() => setFilter("hidden")}
                className={`${
                  filter === "hidden"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
              >
                Hidden ({hiddenArticles.size})
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Articles List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {filteredArticles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No articles found</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredArticles.map((article) => {
              const isHidden = hiddenArticles.has(article.id)
              return (
                <li
                  key={article.id}
                  className={`${isHidden ? "bg-gray-50 opacity-60" : "bg-white"}`}
                >
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {article.category}
                          </span>
                          {isHidden && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Hidden
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {article.title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                          {article.excerpt}
                        </p>
                        <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                          <span>{article.source_name}</span>
                          <span>•</span>
                          <span>{formatDate(article.published_at)}</span>
                          {article.view_count > 0 && (
                            <>
                              <span>•</span>
                              <span>{article.view_count} views</span>
                            </>
                          )}
                        </div>
                        {article.tags && article.tags.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {article.tags.map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="ml-4 flex-shrink-0 flex flex-col gap-2">
                        <button
                          onClick={() => toggleArticleVisibility(article.id)}
                          className={`${
                            isHidden
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : "bg-red-100 text-red-800 hover:bg-red-200"
                          } px-3 py-1 rounded text-sm font-medium transition-colors`}
                        >
                          {isHidden ? "Show" : "Hide"}
                        </button>
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-gray-100 text-gray-800 hover:bg-gray-200 rounded text-sm font-medium text-center"
                        >
                          View
                        </a>
                      </div>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
