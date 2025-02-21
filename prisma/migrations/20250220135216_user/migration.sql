-- AlterTable
ALTER TABLE "User" ALTER COLUMN "achievements" DROP NOT NULL,
ALTER COLUMN "achievements" SET DATA TYPE TEXT;
