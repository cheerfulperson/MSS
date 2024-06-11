/*
  Warnings:

  - You are about to drop the column `guestId` on the `RefreshToken` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `Home` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Home` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Home" ADD COLUMN     "slug" TEXT NOT NULL,
ALTER COLUMN "secured" SET DEFAULT false;

-- AlterTable
ALTER TABLE "RefreshToken" DROP COLUMN "guestId";

-- CreateIndex
CREATE UNIQUE INDEX "Home_slug_key" ON "Home"("slug");
