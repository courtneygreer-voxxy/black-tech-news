import { auth } from "@/auth"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const session = await auth()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { whitelist, blacklist } = await request.json()

    // TODO: Replace with actual Wolf Development Studio API endpoint
    // For now, this is a placeholder that you'll need to implement
    // based on Wolf Studio's API documentation

    const wolfStudioApiUrl = process.env.WOLF_STUDIO_API_URL || process.env.NEXT_PUBLIC_API_URL
    const wolfStudioApiKey = process.env.WOLF_STUDIO_API_KEY

    if (!wolfStudioApiKey) {
      return NextResponse.json(
        { error: "Wolf Studio API key not configured" },
        { status: 500 }
      )
    }

    // Example sync request to Wolf Development Studio
    // Adjust this based on the actual API endpoint and format
    const response = await fetch(`${wolfStudioApiUrl}/api/admin/keywords`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${wolfStudioApiKey}`,
      },
      body: JSON.stringify({
        whitelist,
        blacklist,
        source: "black-tech-news",
        updated_by: session.user?.email,
      }),
    })

    if (!response.ok) {
      throw new Error(`Wolf Studio API returned ${response.status}`)
    }

    const data = await response.json()

    return NextResponse.json({
      success: true,
      message: "Keywords synced to Wolf Development Studio",
      data,
    })
  } catch (error) {
    console.error("Failed to sync keywords to Wolf Studio:", error)
    return NextResponse.json(
      {
        error: "Failed to sync keywords to Wolf Development Studio",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
