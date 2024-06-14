/*
  Warnings:

  - The values [STING] on the enum `ValueType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `DeviceSchemaId` on the `DeviceValueSetup` table. All the data in the column will be lost.
  - You are about to drop the column `mesure` on the `DeviceValueSetup` table. All the data in the column will be lost.
  - Added the required column `deviceSchemaId` to the `DeviceValueSetup` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ValueType_new" AS ENUM ('BOOLEAN', 'NUMBER', 'STRING');
ALTER TABLE "DeviceValueSetup" ALTER COLUMN "valueType" TYPE "ValueType_new" USING ("valueType"::text::"ValueType_new");
ALTER TYPE "ValueType" RENAME TO "ValueType_old";
ALTER TYPE "ValueType_new" RENAME TO "ValueType";
DROP TYPE "ValueType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "DeviceValueSetup" DROP CONSTRAINT "DeviceValueSetup_DeviceSchemaId_fkey";

-- AlterTable
ALTER TABLE "DeviceValueSetup" DROP COLUMN "DeviceSchemaId",
DROP COLUMN "mesure",
ADD COLUMN     "deviceSchemaId" TEXT NOT NULL,
ADD COLUMN     "measure" TEXT;

-- AddForeignKey
ALTER TABLE "DeviceValueSetup" ADD CONSTRAINT "DeviceValueSetup_deviceSchemaId_fkey" FOREIGN KEY ("deviceSchemaId") REFERENCES "DeviceSchema"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
