import { auth } from "@/auth"
import { NextResponse } from "next/server"
import pool from "@/lib/db/client"
import { generateWeeklyTheme } from "@/lib/ai/claude"

// POST /api/admin/summaries/weekly/generate - Generate new weekly summary
export async function POST() {
  const session = await auth()

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Calculate the previous week's date range
    // Week runs Sunday to Saturday, published on Monday
    const today = new Date()
    const dayOfWeek = today.getDay() // 0 = Sunday, 1 = Monday, etc.

    // Find the most recent Saturday (end of last complete week)
    const daysToLastSaturday = dayOfWeek === 0 ? 1 : (dayOfWeek + 1)
    const lastSaturday = new Date(today)
    lastSaturday.setDate(today.getDate() - daysToLastSaturday)
    lastSaturday.setHours(23, 59, 59, 999)

    // Find the Sunday before that (start of last complete week)
    const lastSunday = new Date(lastSaturday)
    lastSunday.setDate(lastSaturday.getDate() - 6)
    lastSunday.setHours(0, 0, 0, 0)

    // Publication date is the Monday after last Saturday
    const publicationDate = new Date(lastSaturday)
    publicationDate.setDate(lastSaturday.getDate() + 2)
    publicationDate.setHours(0, 0, 0, 0)

    // Check if this week already exists
    const existingCheck = await pool.query(
      'SELECT id FROM weekly_summaries WHERE publication_date = $1',
      [publicationDate.toISOString().split('T')[0]]
    )

    if (existingCheck.rows.length > 0) {
      return NextResponse.json(
        { error: "A summary for this week already exists" },
        { status: 400 }
      )
    }

    // Fetch articles from the Wolf Studio API for that week
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://wolf-development-studio.vercel.app'
    const response = await fetch(`${apiUrl}/api/articles/list?limit=100`)

    if (!response.ok) {
      throw new Error(`Failed to fetch articles: ${response.statusText}`)
    }

    const data = await response.json()
    const allArticles = data.articles || []

    // Filter articles that were published during the target week
    const weekArticles = allArticles.filter((article: any) => {
      const publishedDate = new Date(article.published_at)
      return publishedDate >= lastSunday && publishedDate <= lastSaturday
    })

    if (weekArticles.length === 0) {
      return NextResponse.json(
        { error: "No articles found for this week" },
        { status: 400 }
      )
    }

    // Take top 10 articles (they're already sorted by published_at DESC from the API)
    const topArticles = weekArticles.slice(0, 10)
    const articleIds = topArticles.map((a: any) => a.external_id)

    // Generate AI theme using Claude
    const theme = await generateWeeklyTheme(
      topArticles.map((a: any) => ({
        title: a.title,
        excerpt: a.excerpt,
        url: a.url,
      })),
      lastSunday,
      lastSaturday
    )

    // Generate title
    const weekStartStr = lastSunday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    const weekEndStr = lastSaturday.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    const title = `Weekly Digest: ${weekStartStr} - ${weekEndStr}`

    // Insert into database
    const result = await pool.query(
      `INSERT INTO weekly_summaries
        (week_start, week_end, publication_date, title, theme, article_ids, article_count, created_by, is_published)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, false)
      RETURNING id`,
      [
        lastSunday.toISOString().split('T')[0],
        lastSaturday.toISOString().split('T')[0],
        publicationDate.toISOString().split('T')[0],
        title,
        theme,
        articleIds,
        weekArticles.length,
        session.user.email,
      ]
    )

    return NextResponse.json({
      success: true,
      id: result.rows[0].id,
      articleCount: topArticles.length,
      totalArticles: weekArticles.length,
    })
  } catch (error) {
    console.error("Error generating weekly summary:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate summary" },
      { status: 500 }
    )
  }
}
