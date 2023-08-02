/*
  Warnings:

  - You are about to drop the column `endsOn` on the `Mission` table. All the data in the column will be lost.
  - You are about to drop the column `startsFrom` on the `Mission` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Mission" DROP COLUMN "endsOn",
DROP COLUMN "startsFrom";

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "mapImage" VARCHAR(255) NOT NULL,
    "mapImageUrl" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastModified" TIMESTAMPTZ,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);
