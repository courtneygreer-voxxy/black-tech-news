import { auth } from "@/auth"
import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db/client"

// DELETE /api/admin/summaries/weekly/[id] - Delete a summary
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    const result = await pool.query(
      'DELETE FROM weekly_summaries WHERE id = $1 RETURNING id',
      [id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Summary not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting summary:", error)
    return NextResponse.json(
      { error: "Failed to delete summary" },
      { status: 500 }
    )
  }
}
