-- AlterTable
ALTER TABLE "Guest" ADD COLUMN     "refreshToken" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "fullName" TEXT,
ADD COLUMN     "refreshToken" TEXT;
