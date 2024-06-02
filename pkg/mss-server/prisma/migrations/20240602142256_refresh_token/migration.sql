/*
  Warnings:

  - You are about to drop the column `ipAddress` on the `Guest` table. All the data in the column will be lost.
  - You are about to drop the column `refreshToken` on the `Guest` table. All the data in the column will be lost.
  - You are about to drop the column `userAgent` on the `Guest` table. All the data in the column will be lost.
  - You are about to drop the column `refreshToken` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[refreshTokenId]` on the table `Guest` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Guest" DROP COLUMN "ipAddress",
DROP COLUMN "refreshToken",
DROP COLUMN "userAgent",
ADD COLUMN     "refreshTokenId" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "refreshToken";

-- CreateTable
CREATE TABLE "RefreshToken" (
    "token" TEXT NOT NULL,
    "ipv4" TEXT NOT NULL,
    "userAgent" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,
    "guestId" TEXT,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("ipv4","userAgent")
);

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_token_key" ON "RefreshToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Guest_refreshTokenId_key" ON "Guest"("refreshTokenId");

-- AddForeignKey
ALTER TABLE "Guest" ADD CONSTRAINT "Guest_refreshTokenId_fkey" FOREIGN KEY ("refreshTokenId") REFERENCES "RefreshToken"("token") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
