/*
  Warnings:

  - The `deviceType` column on the `Device` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `deviceType` column on the `DeviceSchema` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "DeviceType" AS ENUM ('ALARM', 'CAMERA', 'GAS_DETECTOR', 'LIGHT_SWITCH', 'LOCK', 'MAGNETIC_CONTACT_SENSOR', 'MOTION_SENSOR', 'SMART_PLUG', 'SWITCH', 'THERMOSTAT', 'WATER_LEAK_DETECTOR', 'HUMIDITY_SENSOR', 'MULTI_DEVICE');

-- AlterTable
ALTER TABLE "Device" DROP COLUMN "deviceType",
ADD COLUMN     "deviceType" "DeviceType";

-- AlterTable
ALTER TABLE "DeviceSchema" DROP COLUMN "deviceType",
ADD COLUMN     "deviceType" "DeviceType" NOT NULL DEFAULT 'MULTI_DEVICE';

-- DropEnum
DROP TYPE "DeviceTypes";
