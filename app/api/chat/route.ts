import type { NextRequest } from "next/server"
import { streamText } from "ai"
import { xai } from "@ai-sdk/xai"

// NOTE: Ensure XAI_API_KEY is set via the Grok integration in Project Settings.

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const messages = body?.messages ?? []

    const result = await streamText({
      model: xai("grok-4"),
      messages,
      // Friendly assistant that speaks clearly
      system:
        "You are a helpful, concise chat assistant. Prefer short, clear messages. Use bullet points when listing items.",
    })

    // Use plain text streaming so the client can read chunks via fetch
    return result.toTextStreamResponse()
  } catch (err) {
    console.error("[v0] /api/chat error:", err)
    return new Response("Failed to generate response", { status: 500 })
  }
}
