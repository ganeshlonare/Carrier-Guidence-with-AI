/*
  Warnings:

  - You are about to drop the column `pastAchievements` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `project` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "pastAchievements",
DROP COLUMN "project",
ADD COLUMN     "achievements" TEXT[],
ADD COLUMN     "projects" TEXT;
