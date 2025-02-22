"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { generateAIInsights } from "./dashboard";

export async function updateUser(data) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({
      status: "error",
      message: "Unauthorized"
    })
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user){
    return Response.json({
      status: "error",
      message: "User Not found"
    })
  }

  try {
    // Start a transaction to handle both operations
    const result = await db.$transaction(
      async (tx) => {
        // First check if industry exists
        let industryInsight = await tx.industryInsight.findUnique({
          where: {
            industry: data.industry,
          },
        });

        // If industry doesn't exist, create it with default values
        if (!industryInsight) {
          const insights = await generateAIInsights(data.industry);

          industryInsight = await db.industryInsight.create({
            data: {
              industry: data.industry,
              ...insights,
              nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
          });
        }

        // Now update the user
        const updatedUser = await tx.user.update({
          where: {
            id: user.id,
          },
          data: {
            industry: data.industry,
            experience: data.experience,
            bio: data.bio,
            skills: data.skills,
            level: data.level
          },
        });

        return { updatedUser, industryInsight };
      },
      {
        timeout: 10000, // default: 5000
      }
    );

    revalidatePath("/");
    return result.user;
  } catch (error) {
    console.error("Error updating user and industry:", error.message);
    return Response.json({
      status: "error",
      message: "Failed to update profile"
    })
  }
}

export async function getUserOnboardingStatus() {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({
      message:"Unauthorized"
    })
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    return Response.json({
      message:"user not found"
    })
  }

  try {
    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
      select: {
        industry: true,
      },
    });

    if (!user) {
      return Response.json({
        status: "error",
        message: "Failed to check user status"
      })
    }

    return {
      isOnboarded: !!user?.industry,
    };
  } catch (error) {
    console.log(error)
    console.error("Error checking onboarding status:", error);
    return Response.json({
      status: "error",
      message: "Failed to check onboarding status"
    })
  }
}

export async function handleNextOnboarding(data) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({
      status: "error",
      message: "Unauthorized"
    })
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user){
    return Response.json({
      status: "error",
      message: "User Not found"
    })
  }
  try {
    const updatedUser = await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        target: data.target,
        achievements: data.achievements,
        projects: data.projects
      },
    });

    return { updatedUser };
  } catch (error) {
    console.error("Error updating user and industry:", error.message);
    return Response.json({
      status: "error",
      message: "Failed to update profile"
    })
  }
}
export async function getUserOnboardingNextStatus() {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({
      message:"Unauthorized"
    })
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    return Response.json({
      message:"user not found"
    })
  }

  try {
    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
      select: {
        target: true,
      },
    });

    if (!user) {
      return Response.json({
        status: "error",
        message: "Failed to check user status"
      })
    }

    return {
      isOnboarded: !!user?.target,
    };
  } catch (error) {
    console.log(error)
    console.error("Error checking onboarding status:", error);
    return Response.json({
      status: "error",
      message: "Failed to check onboarding status"
    })
  }
}