// "use server";

// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { db } from "@/lib/prisma";
// import { auth } from "@clerk/nextjs/server";

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// export async function generateCodeSnippet(field, level) {
    
//   const { userId } = await auth();
//   if (!userId) throw new Error("Unauthorized");

//   const user = await db.user.findUnique({
//     where: { clerkUserId: userId },
//   });

//   if (!user) {
//     return Response.json({
//       status: "error",
//       message: "Unauthorized"
//     })
//   }

//   const prompt = `You are a code generation assistant designed to create debugging challenges. Your primary function is to produce code snippets with intentional errors and **Syntactical Errors** like missing braces , brackets and other things and please do 3-5 Syntax errors please and dont provide any comments please.

//   User:-
//   1. User Skills : ${user.skills.join(", ")},
//   2. User Target : ${user.target}
//   3. User Industry : ${user.industry}
//   4. User Level : ${user.level}

// **Instructions:**

// 1.  **Input:** You will receive user information including their skills, level, target goal, and industry.
// 2.  **Output:** Generate a single, concise code snippet that aligns with the user's provided information.
// 3.  **Language:** Use any one programming language from the user's provided skills.
// 4.  **Errors:** Intentionally introduce 3-4 distinct errors into the code. These errors should be common mistakes that a developer at the user's level might encounter.
// 5.  **Focus:** The code should be designed for debugging practice, not for functionality.
// 6.  **Constraints:**
//     * Do not include any comments or explanations within the code.
//     * Do not generate any text outside of the code snippet.
//     * Generate only one code snippet.
//     * The code should be of an appropriate length for debugging, neither too long nor too short.
// 7.  **Goal Alignment:** ensure that the code snippet is related to the users target goal and industry.
// 8.  **Level Alignment:** ensure that the errors are appropriate for the user level.

// make it usefull by adding our user.values`;

//   try {
//     const result = await model.generateContent(prompt);
//     const response = result.response;
//     const codeSnippet = response.text().trim();
//     console.log(codeSnippet)
//     return codeSnippet;
//   } catch (error) {
//     console.error("Error generating code snippet:", error);
//     throw new Error("Failed to generate code snippet");
//   }
// }



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

export async function generateCodeSnippet(user) {
  const prompt = `You are a code generation assistant designed to create debugging challenges. Your primary function is to produce code snippets with intentional errors and **Syntactical Errors** like missing braces , brackets and other things and please do 3-5 Syntax errors please and dont provide any comments please.

  User:-
  1. User Skills : ${user?.skills} || ["Java"]
  2. User Target : ${user.target}
  3. User Industry : ${user.industry}
  4. User Level : ${user.level}

**Instructions:**

1.  **Input:** You will receive user information including their skills, level, target goal, and industry.
2.  **Output:** Generate a single, concise code snippet that aligns with the user's provided information.
3.  **Language:** Use any one programming language from the user's provided skills.
4.  **Errors:** Intentionally introduce 3-4 distinct errors into the code. These errors should be common mistakes that a developer at the user's level might encounter.
5.  **Focus:** The code should be designed for debugging practice, not for functionality.
6.  **Constraints:**
    * Do not include any comments or explanations within the code.
    * Do not generate any text outside of the code snippet.
    * Generate only one code snippet.
    * The code should be of an appropriate length for debugging, neither too long nor too short.
7.  **Goal Alignment:** ensure that the code snippet is related to the users target goal and industry.
8.  **Level Alignment:** ensure that the errors are appropriate for the user level.

make it usefull by adding our user.values`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const codeSnippet = extractCode(response.text());
    return codeSnippet;
  } catch (error) {
    console.error("Error generating code snippet:", error);
    throw new Error("Failed to generate code snippet");
  }
}