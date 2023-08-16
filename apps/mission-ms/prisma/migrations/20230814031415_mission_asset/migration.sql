-- CreateEnum
CREATE TYPE "MissionAssetType" AS ENUM ('VIDEO', 'IMAGE');

-- CreateTable
CREATE TABLE "MissionAssets" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "cloudId" VARCHAR(255) NOT NULL,
    "cloudLink" VARCHAR(255) NOT NULL,
    "type" "MissionAssetType" NOT NULL DEFAULT 'IMAGE',

    CONSTRAINT "MissionAssets_pkey" PRIMARY KEY ("id")
);
