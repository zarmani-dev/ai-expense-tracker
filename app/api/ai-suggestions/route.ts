import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { expenses, apiKey, currencySymbol } = await request.json();

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key is required" },
        { status: 400 }
      );
    }

    if (!expenses || !Array.isArray(expenses) || expenses.length === 0) {
      return NextResponse.json(
        { error: "Valid expenses data is required" },
        { status: 400 }
      );
    }

    // Calculate total spending
    const totalAmount = expenses.reduce(
      (sum, expense) => sum + Number(expense.amount),
      0
    );

    // Group by category
    const categoryData = expenses.reduce((acc, expense) => {
      if (!acc[expense.category]) {
        acc[expense.category] = 0;
      }

      acc[expense.category] += Number(expense.amount);
      return acc;
    }, {});

    // Sort categories by amount
    const sortedCategories = Object.entries(categoryData)
      .sort((a, b) => b[1] - a[1])
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: ((amount as number) / totalAmount) * 100,
      }));

    // Prepare the prompt for Gemini
    const prompt = `
      As a financial advisor, analyze this expense data and provide 3 specific, actionable, and personalized suggestions to help reduce expenses. 
      Each suggestion should be concise (max 2 sentences) and directly related to the user's spending habits.
      Format each suggestion with a short title and a brief description.
      
      Expense Summary:
      - Total Spending: ${currencySymbol} ${totalAmount.toFixed(2)}
      - Number of Transactions: ${expenses.length}
      
      Top Spending Categories:
      ${sortedCategories
        .slice(0, 3)
        .map(
          (cat) =>
            `- ${cat.category}: ${currencySymbol} ${(
              cat.amount as number
            ).toFixed(2)} (${cat.percentage.toFixed(1)}% of total)`
        )
        .join("\n")}
      
      Recent Expenses (last 5):
      ${expenses
        .slice(-5)
        .reverse()
        .map(
          (exp) =>
            `- ${currencySymbol} ${Number(exp.amount).toFixed(2)} on ${
              exp.name
            } (${exp.category})`
        )
        .join("\n")}
      
      Format your response as a JSON array with this structure:
      [
        {
          "title": "Short, catchy title",
          "description": "Concise, actionable and B2 level English suggestion"
        },
        ...
      ]
      
      Only respond with the JSON array, no other text.
    `;

    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.2,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API error:", errorData);
      return NextResponse.json(
        { error: "Failed to get suggestions from Gemini API" },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Extract the text from Gemini's response
    const responseText = data.candidates[0].content.parts[0].text;

    // Parse the JSON from the response
    let suggestions;
    try {
      // Find JSON in the response (in case the model adds extra text)
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        suggestions = JSON.parse(jsonMatch[0]);
      } else {
        suggestions = JSON.parse(responseText);
      }

      // Add IDs to each suggestion
      suggestions = suggestions.map((suggestion, index) => ({
        ...suggestion,
        id: index + 1,
      }));
    } catch (error) {
      console.error("Error parsing Gemini response:", error);
      console.log("Raw response:", responseText);
      return NextResponse.json(
        { error: "Failed to parse AI suggestions" },
        { status: 500 }
      );
    }

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
