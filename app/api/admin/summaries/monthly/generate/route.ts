import { auth } from "@/auth"
import { NextResponse } from "next/server"
import pool from "@/lib/db/client"
import { generateMonthlyTheme } from "@/lib/ai/gemini"

// POST /api/admin/summaries/monthly/generate - Generate new monthly summary
export async function POST() {
  const session = await auth()

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Calculate the previous month's date range
    const today = new Date()

    // Get first day of previous month
    const monthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1)
    monthStart.setHours(0, 0, 0, 0)

    // Get last day of previous month
    const monthEnd = new Date(today.getFullYear(), today.getMonth(), 0)
    monthEnd.setHours(23, 59, 59, 999)

    // Publication date is the first Monday of the current month
    const firstDayOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const firstDayWeekday = firstDayOfCurrentMonth.getDay()

    // Calculate days to add to get to first Monday (1 = Monday)
    let daysToFirstMonday = 0
    if (firstDayWeekday === 0) {
      daysToFirstMonday = 1 // Sunday -> Monday
    } else if (firstDayWeekday === 1) {
      daysToFirstMonday = 0 // Already Monday
    } else {
      daysToFirstMonday = 8 - firstDayWeekday // Tue-Sat -> next Monday
    }

    const publicationDate = new Date(firstDayOfCurrentMonth)
    publicationDate.setDate(firstDayOfCurrentMonth.getDate() + daysToFirstMonday)
    publicationDate.setHours(0, 0, 0, 0)

    // Check if this month already exists
    const existingCheck = await pool.query(
      'SELECT id FROM monthly_summaries WHERE publication_date = $1',
      [publicationDate.toISOString().split('T')[0]]
    )

    if (existingCheck.rows.length > 0) {
      return NextResponse.json(
        { error: "A report for this month already exists" },
        { status: 400 }
      )
    }

    // Fetch articles from the Wolf Studio API
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://wolf-development-studio.vercel.app'
    const response = await fetch(`${apiUrl}/api/articles/list?limit=200`)

    if (!response.ok) {
      throw new Error(`Failed to fetch articles: ${response.statusText}`)
    }

    const data = await response.json()
    const allArticles = data.articles || []

    // Filter articles that were published during the target month
    const monthArticles = allArticles.filter((article: any) => {
      const publishedDate = new Date(article.published_at)
      return publishedDate >= monthStart && publishedDate <= monthEnd
    })

    if (monthArticles.length === 0) {
      return NextResponse.json(
        { error: "No articles found for this month" },
        { status: 400 }
      )
    }

    // Take top 10 articles
    const topArticles = monthArticles.slice(0, 10)
    const articleIds = topArticles.map((a: any) => a.external_id)

    // Generate AI theme using Claude
    const theme = await generateMonthlyTheme(
      topArticles.map((a: any) => ({
        title: a.title,
        excerpt: a.excerpt,
        url: a.url,
      })),
      monthStart,
      monthEnd
    )

    // Generate title
    const monthName = monthStart.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    const title = `State of Black Tech: ${monthName}`

    // Insert into database
    const result = await pool.query(
      `INSERT INTO monthly_summaries
        (month_start, month_end, publication_date, title, theme, article_ids, article_count, created_by, is_published)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, false)
      RETURNING id`,
      [
        monthStart.toISOString().split('T')[0],
        monthEnd.toISOString().split('T')[0],
        publicationDate.toISOString().split('T')[0],
        title,
        theme,
        articleIds,
        monthArticles.length,
        session.user.email,
      ]
    )

    return NextResponse.json({
      success: true,
      id: result.rows[0].id,
      articleCount: topArticles.length,
      totalArticles: monthArticles.length,
    })
  } catch (error) {
    console.error("Error generating monthly summary:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate report" },
      { status: 500 }
    )
  }
}
