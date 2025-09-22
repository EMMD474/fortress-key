/*
  Warnings:

  - You are about to drop the column `expireAt` on the `UserOTP` table. All the data in the column will be lost.
  - Added the required column `expiresAt` to the `UserOTP` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."UserOTP" DROP COLUMN "expireAt",
ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL;
