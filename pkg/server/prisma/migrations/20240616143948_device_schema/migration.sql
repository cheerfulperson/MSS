/*
  Warnings:

  - A unique constraint covering the columns `[deviceId,key]` on the table `DeviceValueSetup` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "DeviceType" ADD VALUE 'PRESSURE_SENSOR';

-- DropForeignKey
ALTER TABLE "Device" DROP CONSTRAINT "Device_deviceSchemaId_fkey";

-- DropForeignKey
ALTER TABLE "DeviceValueSetup" DROP CONSTRAINT "DeviceValueSetup_deviceSchemaId_fkey";

-- AlterTable
ALTER TABLE "Device" ALTER COLUMN "deviceSchemaId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "DeviceValueSetup" ALTER COLUMN "deviceSchemaId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "DeviceValueSetup_deviceId_key_key" ON "DeviceValueSetup"("deviceId", "key");

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_deviceSchemaId_fkey" FOREIGN KEY ("deviceSchemaId") REFERENCES "DeviceSchema"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeviceValueSetup" ADD CONSTRAINT "DeviceValueSetup_deviceSchemaId_fkey" FOREIGN KEY ("deviceSchemaId") REFERENCES "DeviceSchema"("id") ON DELETE SET NULL ON UPDATE CASCADE;
