/*
  Warnings:

  - You are about to drop the column `device` on the `Guest` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Guest` table. All the data in the column will be lost.
  - You are about to drop the column `shareCode` on the `Home` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `User` table. All the data in the column will be lost.
  - Added the required column `fullName` to the `Guest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Guest" DROP COLUMN "device",
DROP COLUMN "name",
ADD COLUMN     "fullName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Home" DROP COLUMN "shareCode",
ADD COLUMN     "password" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "firstName",
DROP COLUMN "lastName";
