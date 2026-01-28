import { auth } from "@/auth"
import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db/client"

// POST /api/admin/summaries/monthly/[id]/publish - Toggle publish status
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { is_published } = body

    const result = await pool.query(
      `UPDATE monthly_summaries
       SET is_published = $1,
           published_at = CASE WHEN $1 = true THEN CURRENT_TIMESTAMP ELSE NULL END
       WHERE id = $2
       RETURNING id`,
      [is_published, params.id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Summary not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating publish status:", error)
    return NextResponse.json(
      { error: "Failed to update publish status" },
      { status: 500 }
    )
  }
}
