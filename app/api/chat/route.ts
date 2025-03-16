import { Groq } from "groq-sdk"
import { NextResponse } from "next/server"

if (!process.env.GROQ_API_KEY) {
  throw new Error("Missing GROQ_API_KEY environment variable")
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { messages = [], extractedText, jsonData, isRequestingEmail, personalDetails , wordLimit=100 } = await req.json()

    const systemPrompt = {
      role: "system",
      content:
        `You are a helpful assistant. Respond in JSON format with email, subject, and body fields. The body should be in markdown format.Note don't add any heading text. Email should be recruitment's email from Job description. Keep your response under ${wordLimit} words.`,
    }

    if (true) {
      systemPrompt.content += `Write a professional job application email for the position of [Job Title] at [Company Name] in Markdown format. The email should be formal, well-structured, and written in paragraph form without headings. Start with a polite introduction, mention relevant skills and experience, express enthusiasm for the role, and conclude with a strong closing statement, requesting an opportunity for further discussion or an interview. Keep the tone professional, concise, and engaging. Ensure the email body is formatted correctly using Markdown syntax. Do not include any information that is not specifically requested or relevant to the job application.IMPORTANT: Keep your response under ${wordLimit} words total.`
    }

    const personalDetailsMessage = {
      role: "user",
      content: `Use the following personal details in the email only if they are relevant to the job description: ${JSON.stringify(personalDetails)}.`,
    }

    const extractedTextMessage = extractedText
      ? {
          role: "user",
          content: `Additional Job detail context from uploaded image: ${extractedText}`,
        }
      : null

      // kep only last 3 messages context
    const formattedMessages = messages.slice(-3).map(({ role, content }: any) => ({
      role,
      content: typeof content === "string" ? content : JSON.stringify(content),
    }))

    const combinedMessages = [
      systemPrompt,
      personalDetailsMessage,
      ...(extractedTextMessage ? [extractedTextMessage] : []),
      ...formattedMessages,
    ]

    const completion = await groq.chat.completions.create({
      messages: combinedMessages,
      model: "deepseek-r1-distill-llama-70b",
      temperature: 0.7,
      max_tokens: 1000,
      top_p: 1,
      stream: false,
      stop: null,
      response_format: {
        type: "json_object",
      },
    })

    const responseContent = completion.choices[0]?.message?.content || ""
    console.log("responseContent___________________________________>", responseContent)
    // Parse the JSON response
    const parsedResponse = JSON.parse(responseContent)

    return NextResponse.json(parsedResponse)
  } catch (error) {
    console.error("Error generating text:", error)
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 })
  }
}


