import { auth } from "@/auth"
import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db/client"

export async function GET() {
  const session = await auth()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const result = await pool.query(
      `SELECT keyword, list_type FROM keywords ORDER BY list_type, keyword`
    )

    const whitelist: string[] = []
    const blacklist: string[] = []

    result.rows.forEach((row) => {
      if (row.list_type === "whitelist") {
        whitelist.push(row.keyword)
      } else if (row.list_type === "blacklist") {
        blacklist.push(row.keyword)
      }
    })

    return NextResponse.json({ whitelist, blacklist })
  } catch (error) {
    console.error("Failed to fetch keywords:", error)
    return NextResponse.json(
      { error: "Failed to fetch keywords" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const session = await auth()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { whitelist, blacklist } = await request.json()

    // Clear existing keywords
    await pool.query(`DELETE FROM keywords`)

    // Insert new keywords
    const values: string[] = []
    const params: (string | Date)[] = []
    let paramIndex = 1

    whitelist.forEach((keyword: string) => {
      values.push(`($${paramIndex}, $${paramIndex + 1}, $${paramIndex + 2})`)
      params.push(keyword, "whitelist", new Date())
      paramIndex += 3
    })

    blacklist.forEach((keyword: string) => {
      values.push(`($${paramIndex}, $${paramIndex + 1}, $${paramIndex + 2})`)
      params.push(keyword, "blacklist", new Date())
      paramIndex += 3
    })

    if (values.length > 0) {
      await pool.query(
        `INSERT INTO keywords (keyword, list_type, updated_at) VALUES ${values.join(", ")}`,
        params
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to save keywords:", error)
    return NextResponse.json(
      { error: "Failed to save keywords" },
      { status: 500 }
    )
  }
}
