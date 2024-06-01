/*
  Warnings:

  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - Added the required column `secured` to the `Home` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ButteryState" AS ENUM ('CHARGING', 'DISCHARGING', 'FULL');

-- CreateEnum
CREATE TYPE "FloorPlaneItemType" AS ENUM ('DEVICE', 'DOOR', 'FLOOR', 'LITE', 'WALL', 'WINDOW');

-- CreateEnum
CREATE TYPE "TreatLevel" AS ENUM ('INFO', 'WARN', 'ALARM');

-- CreateEnum
CREATE TYPE "ValueType" AS ENUM ('BOOLEAN', 'NUMBER', 'STING');

-- AlterTable
ALTER TABLE "Home" ADD COLUMN     "secured" BOOLEAN NOT NULL,
ADD COLUMN     "securedAt" TIMESTAMP(3),
ADD COLUMN     "shareCode" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "name",
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "lastName" TEXT;

-- CreateTable
CREATE TABLE "Algoritm" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "homeId" TEXT NOT NULL,

    CONSTRAINT "Algoritm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Buttery" (
    "id" TEXT NOT NULL,
    "maxCapacity" INTEGER NOT NULL,
    "capacity" INTEGER NOT NULL,
    "state" "ButteryState" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deviceId" TEXT,

    CONSTRAINT "Buttery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Device" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "butteryId" TEXT,
    "floorPlaneItemId" TEXT,
    "deviceSchemaId" TEXT NOT NULL,

    CONSTRAINT "Device_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeviceSchema" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deviceTypeId" TEXT NOT NULL,
    "updateTime" INTEGER NOT NULL,

    CONSTRAINT "DeviceSchema_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeviceType" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeviceType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeviceValueSetup" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "displayName" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "key" TEXT NOT NULL,
    "mesure" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "valueType" "ValueType" NOT NULL,
    "max" INTEGER,
    "min" INTEGER,
    "sensitivity" INTEGER,
    "falseInfo" TEXT,
    "trueInfo" TEXT,
    "deviceId" TEXT,
    "DeviceSchemaId" TEXT NOT NULL,

    CONSTRAINT "DeviceValueSetup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeviceValue" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "treatLevel" "TreatLevel" NOT NULL DEFAULT 'INFO',
    "value" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "deviceValueSetupId" TEXT NOT NULL,

    CONSTRAINT "DeviceValue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FloorPlaneItem" (
    "id" TEXT NOT NULL,
    "type" "FloorPlaneItemType" NOT NULL,
    "x" DOUBLE PRECISION NOT NULL,
    "y" DOUBLE PRECISION NOT NULL,
    "width" DOUBLE PRECISION NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "angle" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "floorId" TEXT NOT NULL,

    CONSTRAINT "FloorPlaneItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Floor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "homeId" TEXT NOT NULL,

    CONSTRAINT "Floor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Guest" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "userAgent" TEXT,
    "device" TEXT,

    CONSTRAINT "Guest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TreatLevelSetup" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "level" "TreatLevel" NOT NULL,
    "color" TEXT NOT NULL,
    "icon" TEXT,
    "deviceValueSetupId" TEXT NOT NULL,
    "deviceId" TEXT,

    CONSTRAINT "TreatLevelSetup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_GuestToHome" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Device_butteryId_key" ON "Device"("butteryId");

-- CreateIndex
CREATE UNIQUE INDEX "Device_floorPlaneItemId_key" ON "Device"("floorPlaneItemId");

-- CreateIndex
CREATE UNIQUE INDEX "_GuestToHome_AB_unique" ON "_GuestToHome"("A", "B");

-- CreateIndex
CREATE INDEX "_GuestToHome_B_index" ON "_GuestToHome"("B");

-- AddForeignKey
ALTER TABLE "Algoritm" ADD CONSTRAINT "Algoritm_homeId_fkey" FOREIGN KEY ("homeId") REFERENCES "Home"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_butteryId_fkey" FOREIGN KEY ("butteryId") REFERENCES "Buttery"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_floorPlaneItemId_fkey" FOREIGN KEY ("floorPlaneItemId") REFERENCES "FloorPlaneItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_deviceSchemaId_fkey" FOREIGN KEY ("deviceSchemaId") REFERENCES "DeviceSchema"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeviceSchema" ADD CONSTRAINT "DeviceSchema_deviceTypeId_fkey" FOREIGN KEY ("deviceTypeId") REFERENCES "DeviceType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeviceValueSetup" ADD CONSTRAINT "DeviceValueSetup_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeviceValueSetup" ADD CONSTRAINT "DeviceValueSetup_DeviceSchemaId_fkey" FOREIGN KEY ("DeviceSchemaId") REFERENCES "DeviceSchema"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeviceValue" ADD CONSTRAINT "DeviceValue_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeviceValue" ADD CONSTRAINT "DeviceValue_deviceValueSetupId_fkey" FOREIGN KEY ("deviceValueSetupId") REFERENCES "DeviceValueSetup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FloorPlaneItem" ADD CONSTRAINT "FloorPlaneItem_floorId_fkey" FOREIGN KEY ("floorId") REFERENCES "Floor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Floor" ADD CONSTRAINT "Floor_homeId_fkey" FOREIGN KEY ("homeId") REFERENCES "Home"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TreatLevelSetup" ADD CONSTRAINT "TreatLevelSetup_deviceValueSetupId_fkey" FOREIGN KEY ("deviceValueSetupId") REFERENCES "DeviceValueSetup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TreatLevelSetup" ADD CONSTRAINT "TreatLevelSetup_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GuestToHome" ADD CONSTRAINT "_GuestToHome_A_fkey" FOREIGN KEY ("A") REFERENCES "Guest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GuestToHome" ADD CONSTRAINT "_GuestToHome_B_fkey" FOREIGN KEY ("B") REFERENCES "Home"("id") ON DELETE CASCADE ON UPDATE CASCADE;
