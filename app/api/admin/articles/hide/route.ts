import { auth } from "@/auth"
import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db/client"

export async function POST(request: NextRequest) {
  const session = await auth()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { articleId, hidden } = await request.json()

    // Store hidden article in database
    if (hidden) {
      await pool.query(
        `INSERT INTO hidden_articles (article_id, hidden_at, hidden_by)
         VALUES ($1, NOW(), $2)
         ON CONFLICT (article_id) DO NOTHING`,
        [articleId, session.user?.email]
      )
    } else {
      await pool.query(
        `DELETE FROM hidden_articles WHERE article_id = $1`,
        [articleId]
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to update article visibility:", error)
    return NextResponse.json(
      { error: "Failed to update article visibility" },
      { status: 500 }
    )
  }
}

export async function GET() {
  const session = await auth()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const result = await pool.query(
      `SELECT article_id FROM hidden_articles ORDER BY hidden_at DESC`
    )

    const hiddenIds = result.rows.map((row) => row.article_id)

    return NextResponse.json({ hiddenArticles: hiddenIds })
  } catch (error) {
    console.error("Failed to fetch hidden articles:", error)
    return NextResponse.json(
      { error: "Failed to fetch hidden articles" },
      { status: 500 }
    )
  }
}
