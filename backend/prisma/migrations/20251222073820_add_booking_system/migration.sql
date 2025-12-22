/*
  Warnings:

  - A unique constraint covering the columns `[firebaseUid]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `type` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firebaseUid` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SessionType" AS ENUM ('FIRST', 'FOLLOW_UP');

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "reason" TEXT,
ADD COLUMN     "type" "SessionType" NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "firebaseUid" TEXT NOT NULL,
ALTER COLUMN "name" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_firebaseUid_key" ON "User"("firebaseUid");
