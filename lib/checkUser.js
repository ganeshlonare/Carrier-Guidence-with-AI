import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

export const checkUser = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  try {
    const loggedInUser = await db.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
    });

    if (loggedInUser) {
      return loggedInUser;
    }

    const name = `${user.firstName} ${user.lastName}`;

    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        name,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
      },
    });

    return newUser;
  } catch (error) {
    console.log(error.message);
  }
};


// import { auth } from "@clerk/nextjs/server";
// import { db } from "./prisma";

// export const checkUser = async () => {
//   const { userId } = auth();  // Manually fetch auth info

//   if (!userId) {
//     return null;
//   }

//   try {
//     let loggedInUser = await db.user.findUnique({
//       where: { clerkUserId: userId },
//     });

//     if (!loggedInUser) {
//       loggedInUser = await db.user.findUnique({
//         where: { email: user.emailAddresses[0].emailAddress },
//       });

//       if (loggedInUser && !loggedInUser.clerkUserId) {
//         await db.user.update({
//           where: { email: user.emailAddresses[0].emailAddress },
//           data: { clerkUserId: userId },
//         });
//       }
//     }

//     if (loggedInUser) {
//       return loggedInUser;
//     }

//     const newUser = await db.user.create({
//       data: {
//         clerkUserId: userId,
//         name: `${user.firstName} ${user.lastName}`,
//         imageUrl: user.imageUrl,
//         email: user.emailAddresses[0].emailAddress,
//       },
//     });

//     return newUser;
//   } catch (error) {
//     console.error("Error in checkUser:", error.message);
//     return null;
//   }
// };
