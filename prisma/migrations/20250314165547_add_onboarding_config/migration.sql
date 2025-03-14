/*
  Warnings:

  - You are about to drop the column `address` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `AdminConfig` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "address",
ADD COLUMN     "street" TEXT;

-- DropTable
DROP TABLE "AdminConfig";

-- CreateTable
CREATE TABLE "OnboardingConfig" (
    "id" TEXT NOT NULL,
    "aboutMePage" INTEGER NOT NULL DEFAULT 2,
    "addressPage" INTEGER NOT NULL DEFAULT 2,
    "birthdatePage" INTEGER NOT NULL DEFAULT 3,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OnboardingConfig_pkey" PRIMARY KEY ("id")
);
