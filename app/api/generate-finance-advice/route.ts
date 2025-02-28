import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt =
      "Generate a single, concise financial advice tip (max 20 words) that would be helpful for personal finance management. Make it practical and actionable.";

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return Response.json({ advice: text });
  } catch (error) {
    console.error("Error:", error);
    return Response.json(
      { error: "Failed to generate advice" },
      { status: 500 }
    );
  }
}
