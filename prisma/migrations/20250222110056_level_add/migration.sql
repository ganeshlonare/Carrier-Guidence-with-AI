/*
  Warnings:

  - You are about to drop the column `learningPreferences` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "learningPreferences",
ADD COLUMN     "level" TEXT;
