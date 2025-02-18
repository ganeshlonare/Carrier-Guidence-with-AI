"use server"

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


export async function savePreparation() {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({
        status: "error",
        message: "UnAuthorized"
    })
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: {
      projects: true,
    },
  });

  if (!user) {
    return Response.json({
        status: "error",
        message: "User not found"
    })
  }

  const existingPreparation=await db.preparation.findUnique({
    where: { userId: user.id },
  })
  if (existingPreparation) {
    const jsonStartIndex = existingPreparation.content.indexOf("[");
    const jsonEndIndex = existingPreparation.content.lastIndexOf("]") + 1;
    const jsonString = existingPreparation.content.slice(jsonStartIndex, jsonEndIndex);

    // Validate and parse the JSON
    let preparationJson;
    try {
        preparationJson = JSON.parse(jsonString);
    } catch (error) {
      console.error("Failed to parse JSON:", error);
      return Response.json({
        status: "error",
        message: "Invalid JSON format"
      })
    }
    // console.log(preparationJson)
    return preparationJson;
  }else{
    const existingRoadmap=await db.roadmap.findUnique({
        where: { userId: user.id },
      })
      let roadmapJson;
      if (existingRoadmap) {
        const jsonStartIndex = existingRoadmap.content.indexOf("[");
        const jsonEndIndex = existingRoadmap.content.lastIndexOf("]") + 1;
        const jsonString = existingRoadmap.content.slice(jsonStartIndex, jsonEndIndex);
    
        // Validate and parse the JSON
        try {
          roadmapJson = JSON.parse(jsonString);
        }
        catch (error) {
          console.error("Failed to parse JSON:", error);
          return Response.json({
            status: "error",
            message: "Invalid JSON"
          })
        }
    }
    // console.log(roadmapJson)
    const prompt =`Generate a JSON representation of a week-wise career roadmap, based on the following personal roadmap 
    ROADMAP:- ${roadmapJson}
    . Each week should have a "title" and an array of "data" objects. Each "data" object represents a sub-point within that week's learning plan and should have a "subpoint" description and a "youtube_link" field. Provide direct YouTube links where possible. However, due to the dynamic nature of YouTube content and the specificity of some sub-points, it's understood that perfect, direct links for every sub-point may not exist. Where a direct link isn't readily available, provide a placeholder link like "https://www.youtube.com/watch?v=Qf6e79xW5rI&list=PL9cWq4E-K_jO4Nj9m57Q98P53yRP-AAi7&index=2" or a relevant YouTube channel name (e.g., "freeCodeCamp.org") that users can then search within. Prioritize providing a relevant starting point (video or channel) for the overall theme of the week. If no suitable starting point is found, leave the "youtube_link" as an empty string "". The structure should be as follows:

*****MUST HAVE*****
**Only Give the JSON OUTPUT not any other text**
**There Should be minimum 15 Weeks and each Week must have minimum 5 subpoint's**
**Weeks plan should be exact matching with the given roadmap with each module of the roadmap there should be exact week matching and make this week plan as detailed as possible please**
**The possible links you are generating should be run in the iframe tag in react all should support in this iframe as youtube restrics the permissions we need to add url in this form example :- https://www.youtube.com/embed/zOjov-2OZ0E
    <iframe
        className="w-full h-full"
        src={videoLink}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
    ></iframe>
    
**

json
[
  {
    "week": 1,
    "title": "Week 1 : Week Title",
    "data": [
      {
        "subpoint": "Sub-point description 1",
        "youtube_link": "Direct YouTube link which support iframe and embed videos by youtube OR [https://www.youtube.com/embed/zOjov-2OZ0E] OR Channel Name OR \"\" "
      },
      {
        "subpoint": "Sub-point description 2",
        "youtube_link": "Direct YouTube link OR [https://www.youtube.com/embed/zOjov-2OZ0E] OR Channel Name OR \"\" "
      },
      // ... more sub-points
    ]
  },
  {
    "week": 2,
    "title": "Week 2 : Another Week Title",
    "data": [
      // ... sub-points for this week
    ]
  },
  // ... more weeks
]`

  try {
    const result = await model.generateContent(prompt);
    const preparationContent = result.response.text().trim();

    /////////////////
    const jsonStartIndex = preparationContent.indexOf("[");
    const jsonEndIndex = preparationContent.lastIndexOf("]") + 1;
    const jsonString = preparationContent.slice(jsonStartIndex, jsonEndIndex);

    // Validate and parse the JSON
    let preparationJson;
    try {
        preparationJson = JSON.parse(jsonString);
    } catch (error) {
      console.error("Failed to parse JSON:", error);
      return Response.json({
        status: "error",
        message: "Invalid JSON",
      })
    }

    const roadmap = await db.preparation.upsert({
      where: { userId: user.id },
      update: { content: preparationContent },
      create: { userId: user.id, content: preparationContent },
    });

    // revalidatePath("/roadmap");
    // console.log(preparationJson)
    return preparationJson;
  } catch (error) {
    console.error("Error generating roadmap:", error);
    return Response.json({
        status: "error",
        message: "Failed to generate Preparation plan"
      })
  }
}
}