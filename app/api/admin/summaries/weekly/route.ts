import { auth } from "@/auth"
import { NextResponse } from "next/server"
import pool from "@/lib/db/client"

// GET /api/admin/summaries/weekly - List all weekly summaries
export async function GET() {
  const session = await auth()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const result = await pool.query(`
      SELECT
        id, week_start, week_end, publication_date, title, theme,
        article_count, is_published, created_by, created_at, updated_at, published_at
      FROM weekly_summaries
      ORDER BY publication_date DESC
    `)

    return NextResponse.json({ summaries: result.rows })
  } catch (error) {
    console.error("Error fetching weekly summaries:", error)
    return NextResponse.json(
      { error: "Failed to fetch summaries" },
      { status: 500 }
    )
  }
}
