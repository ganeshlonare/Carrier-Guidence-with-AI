"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function saveRoadmap() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    return Response.json({
      status: "error",
      message: "Unauthorized"
    })
  }

  const existingRoadmap=await db.roadmap.findUnique({
    where: { userId: user.id },
  })
  if (existingRoadmap) {
    const jsonStartIndex = existingRoadmap.content.indexOf("[");
    const jsonEndIndex = existingRoadmap.content.lastIndexOf("]") + 1;
    const jsonString = existingRoadmap.content.slice(jsonStartIndex, jsonEndIndex);

    // Validate and parse the JSON
    let roadmapJson;
    try {
      roadmapJson = JSON.parse(jsonString);
    } catch (error) {
      console.error("Failed to parse JSON:", error);
      return Response.json({
        status: "error",
        message: "Invalid JSON"
      })
    }
    // console.log(roadmapJson)
    return roadmapJson;
  }else{

// const prompt = `
// As an expert career planner and mentor with deep knowledge of industry trends, skill development, and personalized learning strategies, create a highly detailed and actionable learning roadmap for the following student. Your roadmap should be tailored to their unique profile, goals, and current progress, ensuring it is practical, inspiring, and achievable.

// **User Profile**:
// - **Target Goal**: ${user?.target ?? "Not specified"}  
//   *(If not specified, suggest 2-3 potential goals based on their skills and industry.)*
// - **Current Progress**: ${user?.bio ?? "No details provided"}  
//   *(If no details are provided, assume they are starting from scratch and provide a beginner-friendly roadmap.)*
// - **Projects**: ${user?.projects?.length > 0 ? user.projects.map((p) => p.title).join(", ") : "No projects"}  
//   *(If no projects are listed, suggest beginner-friendly projects to build their portfolio.)*
// - **Skills**: ${user?.skills ?? "Not specified"}  
//   *(If no skills are listed, suggest foundational skills based on their industry and target goal.)*
// - **Industry**: ${user?.industry ?? "Not specified"}  
//   *(If no industry is specified, suggest 2-3 industries that align with their skills and goals.)*
// - **Assessment**:${user?.assessments ?? "Not specified"}
//   *(Hey at start we have taken a quiz based on his skills and this is the assessment which he has taken.)*

// ## **Roadmap Structure**:
// 1. **Overview (2-3 sentences)**  
//    - Provide a concise summary of how the user can achieve their goal, including the key milestones and expected outcomes.

// 2. **Phase-wise Breakdown (3-5 phases)**  
//    - Break the roadmap into clear, actionable phases with specific timelines (e.g., 1-3 months per phase).  
//    - For each phase, include:  
//      - **Objective**: What the user should achieve in this phase.  
//      - **Tasks**: Specific, actionable tasks to complete.  
//      - **Resources**: Recommended courses, books, tools, or platforms.  
//      - **Projects**: Hands-on projects to apply their learning.  
//      - **Timeline**: Realistic timeframes for each task or project.  

// 3. **Skill Enhancement Plan**  
//    - Identify the key skills the user needs to develop or improve.  
//    - For each skill, provide:  
//      - **Learning Resources**: Courses, tutorials, or books.  
//      - **Practice Opportunities**: Exercises, challenges, or mini-projects.  
//      - **Assessment**: How they can measure their progress (e.g., quizzes, certifications).  

// 4. **Final Preparation**  
//    - Provide guidance on how to prepare for job applications, interviews, or other goal-specific outcomes. Include:  
//      - **Portfolio Building**: Tips for showcasing their projects and skills.  
//      - **Mock Tests**: Practice tests or interview simulations.  
//      - **Networking**: Strategies for connecting with industry professionals.  
//      - **Interview Tips**: Common questions and how to answer them effectively.  

// 5. **Additional Recommendations**  
//    - Suggest industry-specific tools, technologies, or trends they should be aware of.  
//    - Provide motivational tips to keep them focused and inspired throughout their journey.  

// ### **Requirements**:
// - The roadmap must be **highly personalized** and tailored to the user's profile.  
// - Include **specific, actionable steps** with clear timelines.  
// - Recommend **up-to-date and relevant resources** (courses, tools, platforms, etc.).  
// - Ensure the roadmap is **realistic and achievable** based on the user's current progress.  
// - Use a **professional yet encouraging tone** to motivate the user.  
// - If any information is missing (e.g., skills, industry), make logical assumptions and provide suggestions.  

// ### **Output Format**:
// - Use clear headings and bullet points for readability.  
// - Keep the language concise and actionable.  
// - Avoid generic advice—focus on unique, tailored recommendations.  
// `;

// const prompt = `
// As an expert career planner and mentor with deep knowledge of industry trends, skill development, and personalized learning strategies, create a **highly detailed and actionable learning roadmap in JSON format** for the following student. The roadmap should be tailored to their unique profile, goals, and current progress, ensuring it is **practical, inspiring, and achievable**.

// **User Profile**:
// - **Target Goal**: ${user?.target ?? "Not specified"}  
//   *(If not specified, suggest 2-3 potential goals based on their skills and industry.)*
// - **Current Progress**: ${user?.bio ?? "No details provided"}  
//   *(If no details are provided, assume they are starting from scratch and provide a beginner-friendly roadmap.)*
// - **Projects**: ${user?.projects?.length > 0 ? user.projects.map((p) => p.title).join(", ") : "No projects"}  
//   *(If no projects are listed, suggest beginner-friendly projects to build their portfolio.)*
// - **Skills**: ${user?.skills ?? "Not specified"}  
//   *(If no skills are listed, suggest foundational skills based on their industry and target goal.)*
// - **Industry**: ${user?.industry ?? "Not specified"}  
//   *(If no industry is specified, suggest 2-3 industries that align with their skills and goals.)*
// - **Assessment**: ${user?.assessments ?? "Not specified"}  
//   *(If the user has taken an assessment, incorporate the results to personalize the roadmap.)*

// ## **Roadmap Structure** (in JSON format for React Flow):

// 1. **Nodes Array**  
//    - Each node represents a phase or milestone in the learning journey.  
//    - Structure:  
//      \`\`\`json
//      { "id": "1", "position": { "x": 250, "y": 0 }, "data": { "label": "Phase 1: Fundamentals" }, "type": "default" }
//      \`\`\`

// 2. **Edges Array**  
//    - Each edge represents a logical learning progression between nodes.  
//    - Structure:  
//      \`\`\`json
//      { "id": "e1-2", "source": "1", "target": "2", "animated": true }
//      \`\`\`

// ## **Phases (Nodes) in the Roadmap**:
// - **Phase-wise Breakdown (3-5 phases)**  
//   - Break the roadmap into **clear, actionable phases** with specific timelines (e.g., 1-3 months per phase).  
//   - Each phase should contain:  
//     - **Objective**: What the user should achieve in this phase.  
//     - **Tasks**: Specific, actionable tasks to complete.  
//     - **Resources**: Recommended courses, books, tools, or platforms.  
//     - **Projects**: Hands-on projects to apply their learning.  
//     - **Timeline**: Realistic timeframes for each task or project.  

// ## **Skill Enhancement Plan** (Integrated into Nodes)
// - Identify the key skills the user needs to develop or improve.  
// - Each skill should have:  
//   - **Learning Resources**: Courses, tutorials, or books.  
//   - **Practice Opportunities**: Exercises, challenges, or mini-projects.  
//   - **Assessment**: Ways to measure progress (e.g., quizzes, certifications).  

// ## **Final Preparation Phase**
// - Provide guidance on **job applications, interviews, and final portfolio polishing**.  
// - Include:  
//   - **Portfolio Building**: Tips for showcasing projects and skills.  
//   - **Mock Tests**: Practice tests or interview simulations.  
//   - **Networking**: Strategies for connecting with industry professionals.  
//   - **Interview Tips**: Common questions and best practices.  

// ## **Output Format (React Flow JSON)**:
// \`\`\`json
// {
//   "nodes": [
//     { "id": "1", "position": { "x": 250, "y": 0 }, "data": { "label": "Phase 1: Fundamentals" }, "type": "default" },
//     { "id": "2", "position": { "x": 250, "y": 150 }, "data": { "label": "Phase 2: Intermediate Concepts" }, "type": "default" },
//     { "id": "3", "position": { "x": 250, "y": 300 }, "data": { "label": "Phase 3: Advanced Topics" }, "type": "default" },
//     { "id": "4", "position": { "x": 250, "y": 450 }, "data": { "label": "Phase 4: Projects & Portfolio" }, "type": "default" },
//     { "id": "5", "position": { "x": 250, "y": 600 }, "data": { "label": "Phase 5: Interview & Job Prep" }, "type": "default" }
//   ],
//   "edges": [
//     { "id": "e1-2", "source": "1", "target": "2", "animated": true },
//     { "id": "e2-3", "source": "2", "target": "3", "animated": true },
//     { "id": "e3-4", "source": "3", "target": "4", "animated": true },
//     { "id": "e4-5", "source": "4", "target": "5", "animated": true }
//   ]
// }
// \`\`\`

// ### **Requirements**:
// - The roadmap must be **highly personalized** based on the user’s profile.  
// - Use **React Flow-compatible JSON format** with properly structured nodes and edges.  
// - Ensure **logical positioning** of nodes for clear visualization.  
// - Provide **realistic and actionable learning steps**.  
// - Use **specific, up-to-date resources** (courses, platforms, tools).  
// - Make the roadmap **engaging and achievable** for the user.  

// Generate **only** the JSON output without additional explanations.
// ****Roadmap must be in very very much in detail*****
// `;

// const prompt = `
// As an expert career planner and mentor with deep knowledge of industry trends, skill development, and personalized learning strategies, create a **highly detailed and structured learning roadmap  FLOW CHART in JSON format** for the following student. The FLOW CHART should be **an exact and in-depth representation of roadmap.sh**, ensuring the FLOW CHART is **comprehensive, industry-aligned, and actionable**.

// ### **User Profile**:
// - **Target Goal**: ${user?.target ?? "Not specified"}  
//   *(If not specified, suggest 2-3 potential goals based on their skills and industry.)*
// - **Current Progress**: ${user?.bio ?? "No details provided"}  
//   *(If no details are provided, assume they are starting from scratch and provide a beginner-friendly roadmap.)*
// - **Projects**: ${user?.projects?.length > 0 ? user.projects.map((p) => p.title).join(", ") : "No projects"}  
//   *(If no projects are listed, suggest beginner-friendly projects to build their portfolio.)*
// - **Skills**: ${user?.skills ?? "Not specified"}  
//   *(If no skills are listed, suggest foundational skills based on their industry and target goal.)*
// - **Industry**: ${user?.industry ?? "Not specified"}  
//   *(If no industry is specified, suggest 2-3 industries that align with their skills and goals.)*
// - **Assessment**: ${user?.assessments ?? "Not specified"}  
//   *(If the user has taken an assessment, incorporate the results to personalize the roadmap.)*

// ---

// ## **🔹 Roadmap Structure (in JSON format for React Flow):**
// - Each **node** should be **a structured learning phase** with **clear milestones, sub-topics, and actionable tasks**.  
// - Each **edge** should establish a **logical flow between phases**, ensuring an optimal learning path.

// ### **1️⃣ Nodes Array (Phases)**
// Each **node** represents a **core learning area** with detailed **subtopics**.

// #### **Example Structure:**
// \`\`\`json
// {
//   "id": "1",
//   "position": { "x": 250, "y": 0 },
//   "data": {
//     "label": "Phase 1: Web Development Fundamentals",
//     "topics": [
//       {
//         "name": "HTML & CSS",
//         "tasks": [
//           "Understand HTML structure & semantics",
//           "Learn CSS basics (selectors, flexbox, grid)",
//           "Build static web pages"
//         ],
//         "resources": [
//           "MDN Docs: HTML & CSS",
//           "CSS Tricks: Layout Techniques",
//           "Frontend Mentor Challenges"
//         ]
//       },
//       {
//         "name": "JavaScript Basics",
//         "tasks": [
//           "Learn Variables, Functions, and Loops",
//           "Understand Event Handling & DOM Manipulation",
//           "Practice Async JS (Promises, Fetch API)"
//         ],
//         "resources": [
//           "Eloquent JavaScript",
//           "JavaScript.info",
//           "Frontend Masters: JS Basics"
//         ]
//       }
//     ]
//   },
//   "type": "default"
// }
// \`\`\`

// ---

// ### **2️⃣ Edges Array (Connections)**
// Each **edge** represents **a logical progression between nodes**, ensuring a clear learning path.

// #### **Example Structure:**
// \`\`\`json
// {
//   "id": "e1-2",
//   "source": "1",
//   "target": "2",
//   "animated": true
// }
// \`\`\`

// ---

// ## **📌 Learning Phases (Nodes)**
// - **Phase-wise Breakdown (12-16 phases)**  
//   Each phase should have:  
//   - **Clear objectives** 🎯  
//   - **Detailed sub-topics with specific tasks**  
//   - **Best learning resources (Courses, Books, Docs)**  
//   - **Hands-on projects for practice** 🛠  
//   - **Time estimates for each step** ⏳  

// ## **📌 Output Format (React Flow JSON)**
// \`\`\`json
// {
//   "nodes": [
//     { "id": "1", "position": { "x": 250, "y": 0 }, "data": { "label": "Phase 1: Web Fundamentals" }, "type": "default" },
//     { "id": "2", "position": { "x": 250, "y": 150 }, "data": { "label": "Phase 2: JavaScript Mastery" }, "type": "default" },
//     { "id": "3", "position": { "x": 250, "y": 300 }, "data": { "label": "Phase 3: React & Frontend Frameworks" }, "type": "default" },
//     { "id": "4", "position": { "x": 250, "y": 450 }, "data": { "label": "Phase 4: Backend & Databases" }, "type": "default" },
//     { "id": "5", "position": { "x": 250, "y": 600 }, "data": { "label": "Phase 5: Full-Stack & Deployment" }, "type": "default" },
//     { "id": "6", "position": { "x": 250, "y": 750 }, "data": { "label": "Phase 6: Portfolio & Career Growth" }, "type": "default" }
//   ],
//   "edges": [
//     { "id": "e1-2", "source": "1", "target": "2", "animated": true },
//     { "id": "e2-3", "source": "2", "target": "3", "animated": true },
//     { "id": "e3-4", "source": "3", "target": "4", "animated": true },
//     { "id": "e4-5", "source": "4", "target": "5", "animated": true },
//     { "id": "e5-6", "source": "5", "target": "6", "animated": true }
//   ]
// }
// \`\`\`

// ---

// ### **🚨 Important Requirements:**
// ✅ The FLOW CHART **must be structured like roadmap.sh**, covering all essential topics.  
// ✅ **JSON output must be React Flow-compatible** (nodes & edges).  
// ✅ **Detailed breakdown** with **tasks, resources, and project suggestions**.  
// ✅ **Logical progression** of skills ensuring a smooth learning curve.  
// ✅ **Up-to-date and relevant resources**.  
// ✅ **Actionable, achievable, and inspiring** for the user.  

// 📢 **Generate ONLY the JSON output without extra explanations.**  
// 🚀 **Roadmap must be as detailed as roadmap.sh! and add some distance between nodes and generate a mid level complex roadmap and node should be 20 to 21 please nodes should be 20 to 21**  

// AT THE END WE JUST NEED A DETAILED ROADMAP IN THE FORM OF FLOW CHART FOR LEARNING SO PLEASE PROVIDE A FLOW CHART BY WHICH I CAN FOLLOW IT AND ACHIEVE MY GOALS AND MAKE IT PERSIONALISED WITH RESPECT TO MY PAST LEARNINGS , TARGET AND SKILLS.
// `;

// const prompt=`As an expert career mentor and roadmap designer, generate a **highly detailed and structured learning roadmap** in JSON format. The roadmap should be in **React Flow-compatible format** and should resemble the step-by-step style of roadmap.sh and also add some emojis and also mention on which day what to do and in how many days we have to finish and days must be there.  

// ### **User Profile for Customization**:
// - **Target Goal**: ${user?.target ?? "Not specified"}  
//   *(If not specified, suggest 2-3 potential goals based on their skills and industry.)*  
// - **Current Knowledge Level**: ${user?.bio ?? "Beginner"}  
//   *(Adapt the roadmap accordingly: Beginner, Intermediate, Advanced.)*  
// - **Projects**: ${user?.projects?.length > 0 ? user.projects.map((p) => p.title).join(", ") : "No projects"}  
//   *(If no projects are listed, suggest relevant projects for hands-on learning.)*  
// - **Skills**: ${user?.skills ?? "Not specified"}  
//   *(If no skills are listed, suggest foundational skills based on the selected field.)*  
// - **Industry**: ${user?.industry ?? "Not specified"}  
//   *(Align the roadmap with real-world industry expectations.)*  

// ---

// ### **Roadmap Format (React Flow JSON Output)**  

// 1. **Nodes (Phases in the roadmap)**
//    - Each node represents a key milestone in the learning journey.  
//    - It should have a **unique ID, position, label, type, and styling**.  

// 2. **Edges (Connections between learning steps)**  
//    - Each edge represents the logical learning progression from one phase to the next.  
//    - Ensure **animated transitions** for better visualization.  

// 3. **Roadmap Breakdown (Highly Detailed)**  
//    - Divide into **multiple phases** with well-defined steps.  
//    - Each phase must have:  
//      - **Objective**: Key learning goals for this phase.  
//      - **Tasks**: Actionable steps the user must complete.  
//      - **Resources**: High-quality courses, tutorials, books, and tools.  
//      - **Projects**: Practical assignments for skill application.  
//      - **Estimated Timeframe**: Realistic duration for each step.  
//      - **Assessment**: Quizzes, certifications, or exercises.  

// ---

// ### **Example JSON Output (React Flow-Compatible)**  

// json
// {
//   "nodes": [
//     { "id": "1", "position": { "x": 250, "y": 0 }, "data": { "label": "Start with HTML & CSS" }, "type": "default" },
//     { "id": "2", "position": { "x": 250, "y": 150 }, "data": { "label": "Learn JavaScript" }, "type": "default" },
//     { "id": "3", "position": { "x": 250, "y": 300 }, "data": { "label": "Master React" }, "type": "default" },
//     { "id": "4", "position": { "x": 250, "y": 450 }, "data": { "label": "Understand Node.js & Express" }, "type": "default" },
//     { "id": "5", "position": { "x": 250, "y": 600 }, "data": { "label": "Learn MongoDB & Database Design" }, "type": "default" },
//     { "id": "6", "position": { "x": 250, "y": 750 }, "data": { "label": "Build Full-Stack MERN Projects" }, "type": "default" },
//     { "id": "7", "position": { "x": 250, "y": 900 }, "data": { "label": "Apply for Jobs & Prepare for Interviews" }, "type": "default" }
//   ],
//   "edges": [
//     { "id": "e1-2", "source": "1", "target": "2", "animated": true },
//     { "id": "e2-3", "source": "2", "target": "3", "animated": true },
//     { "id": "e3-4", "source": "3", "target": "4", "animated": true },
//     { "id": "e4-5", "source": "4", "target": "5", "animated": true },
//     { "id": "e5-6", "source": "5", "target": "6", "animated": true },
//     { "id": "e6-7", "source": "6", "target": "7", "animated": true }
//   ]
// }
// `


const prompt =`As an expert career planner and mentor with deep knowledge of industry trends, skill development, and personalized learning strategies, create a highly detailed and actionable learning roadmap for the following student. Your roadmap should be tailored to their unique profile, goals, and current progress, ensuring it is practical, inspiring, and achievable.

**User Profile**:
- **Target Goal**: ${user?.target ?? "Not specified"}  
  *(If not specified, suggest 2-3 potential goals based on their skills and industry.)*
- **Current Progress**: ${user?.bio ?? "No details provided"}  
  *(If no details are provided, assume they are starting from scratch and provide a beginner-friendly roadmap.)*
- **Projects**: ${user?.projects ?? "No projects" }  
  *(If no projects are listed, suggest beginner-friendly projects to build their portfolio.)*
- **Skills**: ${user?.skills ?? "Not specified"}  
  *(If no skills are listed, suggest foundational skills based on their industry and target goal.)*
- **level**: ${user?.level ?? "Not specified"}
  *(if no consider Beginner)
- **Industry**: ${user?.industry ?? "Not specified"}  
  *(If no industry is specified, suggest 2-3 industries that align with their skills and goals.)*
- **Assessment**:${user?.assessments ?? "Not specified"}
  *(Hey at start we have taken a quiz based on his skills and this is the assessment which he has taken.)*

## **Roadmap Structure**:
1. **Overview (2-3 sentences)**  
   - Provide a concise summary of how the user can achieve their goal, including the key milestones and expected outcomes.

2. **Phase-wise Breakdown (3-5 phases)**  
   - Break the roadmap into clear, actionable phases with specific timelines (e.g., 1-3 months per phase).  
   - For each phase, include:  
     - **Objective**: What the user should achieve in this phase.  
     - **Tasks**: Specific, actionable tasks to complete.  
     - **Resources**: Recommended courses, books, tools, or platforms.  
     - **Projects**: Hands-on projects to apply their learning.  
     - **Timeline**: Realistic timeframes for each task or project.  

3. **Skill Enhancement Plan**  
   - Identify the key skills the user needs to develop or improve.  
   - For each skill, provide:  
     - **Learning Resources**: Courses, tutorials, or books.  
     - **Practice Opportunities**: Exercises, challenges, or mini-projects.  
     - **Assessment**: How they can measure their progress (e.g., quizzes, certifications).  

4. **Final Preparation**  
   - Provide guidance on how to prepare for job applications, interviews, or other goal-specific outcomes. Include:  
     - **Portfolio Building**: Tips for showcasing their projects and skills.  
     - **Mock Tests**: Practice tests or interview simulations.  
     - **Networking**: Strategies for connecting with industry professionals.  
     - **Interview Tips**: Common questions and how to answer them effectively.  

5. **Additional Recommendations**  
   - Suggest industry-specific tools, technologies, or trends they should be aware of.  
   - Provide motivational tips to keep them focused and inspired throughout their journey.  

### **Requirements**:
- The roadmap must be **highly personalized** and tailored to the user's profile.  
- Include **specific, actionable steps** with clear timelines.  
- Recommend **up-to-date and relevant resources** (courses, tools, platforms, etc.).  
- Ensure the roadmap is **realistic and achievable** based on the user's current progress.  
- Use a **professional yet encouraging tone** to motivate the user.  
- If any information is missing (e.g., skills, industry), make logical assumptions and provide suggestions.  

### **Output Format**:
- The output should be a JSON array where each element represents a milestone in the roadmap.
- Each milestone object should have the following structure:
  {
    "milestone": "string", // The title of the milestone
    "description": "string", // A brief description of the milestone
    "completed": boolean, // Whether the milestone is completed (default to false)
    "documentationLink": "string" // A link to relevant documentation or resources
  }
- Example:
  [
    {
      "milestone": "Learn Basic Pharmacology",
      "description": "Understand the fundamental principles of pharmacology, including drug classifications and mechanisms of action.",
      "completed": false,
      "documentationLink": "https://example.com/basic-pharmacology"
    },
    {
      "milestone": "Complete Clinical Internship",
      "description": "Gain hands-on experience in a clinical setting, applying pharmacological knowledge to real-world scenarios.",
      "completed": false,
      "documentationLink": "https://example.com/clinical-internship"
    }
  ]
  AND MAKE SURE YOU DONT GIVE ANY TEXT JUST GIVE THE JSON DATA ONLY NOT ANY OTHER TEXT  
  `

  try {
    const result = await model.generateContent(prompt);
    const roadmapContent = result.response.text().trim();

    /////////////////
    const jsonStartIndex = roadmapContent.indexOf("[");
    const jsonEndIndex = roadmapContent.lastIndexOf("]") + 1;
    const jsonString = roadmapContent.slice(jsonStartIndex, jsonEndIndex);

    // Validate and parse the JSON
    let roadmapJson;
    try {
      roadmapJson = JSON.parse(jsonString);
    } catch (error) {
      console.error("Failed to parse JSON:", error);
      return Response.json({
        status: "error",
        message: "Invalid JSON"
      })
    }

    const roadmap = await db.roadmap.upsert({
      where: { userId: user.id },
      update: { content: roadmapContent },
      create: { userId: user.id, content: roadmapContent },
    });

    // revalidatePath("/roadmap");
    // console.log(roadmapContent)
    return roadmapJson;
  } catch (error) {
    console.error("Error generating roadmap:", error);
    return Response.json({
      status: "error",
      message: "Failed to generate Roadmap"
    })
  }
}
}

// export async function getRoadmap() {
//   const { userId } = await auth();
//   if (!userId) throw new Error("Unauthorized");

//   const user = await db.user.findUnique({
//     where: { clerkUserId: userId },
//   });

//   if (!user) throw new Error("User not found");

//   return await db.roadmap.findUnique({
//     where: { userId: user.id },
//   });
// }


export async function getRoadmap() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: {
      projects: true,
    },
  });

  if (!user) throw new Error("User not found");

const prompt = `
As an expert career planner and mentor with deep knowledge of industry trends, skill development, and personalized learning strategies, create a highly detailed and actionable learning roadmap for the following student. Your roadmap should be tailored to their unique profile, goals, and current progress, ensuring it is practical, inspiring, and achievable.

**User Profile**:
- **Target Goal**: ${user?.target ?? "Not specified"}  
  *(If not specified, suggest 2-3 potential goals based on their skills and industry.)*
- **Current Progress**: ${user?.bio ?? "No details provided"}  
  *(If no details are provided, assume they are starting from scratch and provide a beginner-friendly roadmap.)*
- **Projects**: ${user?.projects?.length > 0 ? user.projects.map((p) => p.title).join(", ") : "No projects"}  
  *(If no projects are listed, suggest beginner-friendly projects to build their portfolio.)*
- **Skills**: ${user?.skills ?? "Not specified"}  
  *(If no skills are listed, suggest foundational skills based on their industry and target goal.)*
- **Industry**: ${user?.industry ?? "Not specified"}  
  *(If no industry is specified, suggest 2-3 industries that align with their skills and goals.)*
- **Assessment**:${user?.assessments ?? "Not specified"}
  *(Hey at start we have taken a quiz based on his skills and this is the assessment which he has taken.)*

## **Roadmap Structure**:
1. **Overview (2-3 sentences)**  
   - Provide a concise summary of how the user can achieve their goal, including the key milestones and expected outcomes.

2. **Phase-wise Breakdown (3-5 phases)**  
   - Break the roadmap into clear, actionable phases with specific timelines (e.g., 1-3 months per phase).  
   - For each phase, include:  
     - **Objective**: What the user should achieve in this phase.  
     - **Tasks**: Specific, actionable tasks to complete.  
     - **Resources**: Recommended courses, books, tools, or platforms.  
     - **Projects**: Hands-on projects to apply their learning.  
     - **Timeline**: Realistic timeframes for each task or project.  

3. **Skill Enhancement Plan**  
   - Identify the key skills the user needs to develop or improve.  
   - For each skill, provide:  
     - **Learning Resources**: Courses, tutorials, or books.  
     - **Practice Opportunities**: Exercises, challenges, or mini-projects.  
     - **Assessment**: How they can measure their progress (e.g., quizzes, certifications).  

4. **Final Preparation**  
   - Provide guidance on how to prepare for job applications, interviews, or other goal-specific outcomes. Include:  
     - **Portfolio Building**: Tips for showcasing their projects and skills.  
     - **Mock Tests**: Practice tests or interview simulations.  
     - **Networking**: Strategies for connecting with industry professionals.  
     - **Interview Tips**: Common questions and how to answer them effectively.  

5. **Additional Recommendations**  
   - Suggest industry-specific tools, technologies, or trends they should be aware of.  
   - Provide motivational tips to keep them focused and inspired throughout their journey.  

### **Requirements**:
- The roadmap must be **highly personalized** and tailored to the user's profile.  
- Include **specific, actionable steps** with clear timelines.  
- Recommend **up-to-date and relevant resources** (courses, tools, platforms, etc.).  
- Ensure the roadmap is **realistic and achievable** based on the user's current progress.  
- Use a **professional yet encouraging tone** to motivate the user.  
- If any information is missing (e.g., skills, industry), make logical assumptions and provide suggestions.  

### **Output Format**:
- Use clear headings and bullet points for readability.  
- Keep the language concise and actionable.  
- Avoid generic advice—focus on unique, tailored recommendations.  
`;

  try {
    const result = await model.generateContent(prompt);
    const roadmapContent = result.response.text().trim();
    // console.log(roadmapContent)
    return roadmapContent;
  } catch (error) {
    console.error("Error generating roadmap:", error);
    throw new Error("Failed to generate roadmap");
  }
}