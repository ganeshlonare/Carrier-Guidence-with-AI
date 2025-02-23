"use server";

import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function getChatbotResponse(message) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  if (!message) throw new Error("Message is required");

  const prompt = `You are an AI chatbot. Respond concisely and informatively and give only a plain text not any * or other things we are directly showing your response to the user give all the answers in detail. User: "${message}"`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const botReply = response.text().trim();
    return botReply;
  } catch (error) {
    console.error("Error generating chatbot response:", error);
    throw new Error("Failed to get chatbot response");
  }
}
