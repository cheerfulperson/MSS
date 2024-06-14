/*
  Warnings:

  - You are about to drop the column `deviceTypeId` on the `DeviceSchema` table. All the data in the column will be lost.
  - You are about to drop the `DeviceType` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `clientId` to the `Device` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DeviceKind" AS ENUM ('ACTUATOR', 'SENSOR', 'MULTI_DEVICE');

-- CreateEnum
CREATE TYPE "DeviceTypes" AS ENUM ('ALARM', 'CAMERA', 'GAS_DETECTOR', 'LIGHT_SWITCH', 'LOCK', 'MAGNETIC_CONTACT_SENSOR', 'MOTION_SENSOR', 'SMART_PLUG', 'SWITCH', 'THERMOSTAT', 'WATER_LEAK_DETECTOR', 'HUMIDITY_SENSOR', 'MULTI_DEVICE');

-- AlterEnum
ALTER TYPE "FloorPlaneItemType" ADD VALUE 'IMAGE';

-- DropForeignKey
ALTER TABLE "DeviceSchema" DROP CONSTRAINT "DeviceSchema_deviceTypeId_fkey";

-- AlterTable
ALTER TABLE "Buttery" ALTER COLUMN "maxCapacity" SET DEFAULT 100;

-- AlterTable
ALTER TABLE "Device" ADD COLUMN     "clientId" TEXT NOT NULL,
ADD COLUMN     "deviceType" "DeviceTypes",
ADD COLUMN     "icon" TEXT NOT NULL DEFAULT 'Hdd';

-- AlterTable
ALTER TABLE "DeviceSchema" DROP COLUMN "deviceTypeId",
ADD COLUMN     "deviceKind" "DeviceKind" NOT NULL DEFAULT 'MULTI_DEVICE',
ADD COLUMN     "deviceType" "DeviceTypes" NOT NULL DEFAULT 'MULTI_DEVICE';

-- AlterTable
ALTER TABLE "FloorPlaneItem" ADD COLUMN     "imageId" TEXT;

-- AlterTable
ALTER TABLE "Guest" ADD COLUMN     "avatarColor" TEXT NOT NULL DEFAULT '#1677ff';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatarColor" TEXT NOT NULL DEFAULT '#1677ff';

-- DropTable
DROP TABLE "DeviceType";

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "small" TEXT,
    "medium" TEXT,
    "large" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FloorPlaneItem" ADD CONSTRAINT "FloorPlaneItem_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;
