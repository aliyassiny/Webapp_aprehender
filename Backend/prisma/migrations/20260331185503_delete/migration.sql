/*
  Warnings:

  - You are about to drop the column `recurrenceRule` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the `SessionAttendance` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SessionAttendance" DROP CONSTRAINT "SessionAttendance_sessionId_fkey";

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "recurrenceRule";

-- DropTable
DROP TABLE "SessionAttendance";
