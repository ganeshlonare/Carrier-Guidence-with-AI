"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Function to extract code from the API response
function extractCode(response) {
  const codeRegex = /```[\s\S]*?```/g;
  const matches = response.match(codeRegex);

  if (matches && matches.length > 0) {
    return matches[0].replace(/```/g, "").trim();
  }

  return response.trim();
}

export async function validateCode(userCode, field, level) {
  // Generate the expected corrected code for the given field and level
  const prompt = `Generate the corrected version of the following code snippet for a ${field} task at a ${level} level. The code should fix all intentional errors. Only generate the corrected code snippet without any comments, explanations, or additional text. Code: ${userCode}`;

  try {
    // Get the corrected code from Gemini
    const result = await model.generateContent(prompt);
    const response = result.response;
    const correctedCode = extractCode(response.text());

    // Compare the user's code with the corrected code
    if (userCode.trim() === correctedCode.trim()) {
      return "✅ Correct! You fixed all the errors.";
    } else {
      return "❌ Incorrect. There are still errors in the code. Here is the corrected version:\n\n" + correctedCode;
    }
  } catch (error) {
    console.error("Error validating code:", error);
    throw new Error("Failed to validate code");
  }
}