-- CreateEnum
CREATE TYPE "MachineType" AS ENUM ('BINOCULAR', 'OUTPOST');

-- CreateEnum
CREATE TYPE "MachineStatus" AS ENUM ('USED', 'AVAILABLE');

-- CreateEnum
CREATE TYPE "MissionAssetType" AS ENUM ('VIDEO', 'IMAGE');

-- CreateTable
CREATE TABLE "Mission" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(16) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "duration" INTEGER NOT NULL,
    "distance" VARCHAR(32) NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastModified" TIMESTAMPTZ,

    CONSTRAINT "Mission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastModified" TIMESTAMPTZ,
    "for" "MachineType" NOT NULL DEFAULT 'BINOCULAR',
    "mission_id" TEXT,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Badge" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "badgeImage" VARCHAR(255) NOT NULL,
    "badgeImageUrl" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastModified" TIMESTAMPTZ,
    "activities_completed" INTEGER NOT NULL,
    "mission_id" TEXT,

    CONSTRAINT "Badge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Machine" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "code" VARCHAR(255) NOT NULL,
    "type" "MachineType" NOT NULL,
    "status" "MachineStatus" NOT NULL,
    "player_id" TEXT,

    CONSTRAINT "Machine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Asset" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "cloudId" VARCHAR(255) NOT NULL,
    "cloudLink" VARCHAR(255) NOT NULL,
    "type" "MissionAssetType" NOT NULL DEFAULT 'IMAGE',
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastModified" TIMESTAMPTZ,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MissionAsset" (
    "id" TEXT NOT NULL,
    "mission_id" TEXT,
    "asset_id" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "MissionAssetType" NOT NULL DEFAULT 'IMAGE',

    CONSTRAINT "MissionAsset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Mission_code_key" ON "Mission"("code");

-- CreateIndex
CREATE UNIQUE INDEX "MissionAsset_mission_id_type_key" ON "MissionAsset"("mission_id", "type");

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_mission_id_fkey" FOREIGN KEY ("mission_id") REFERENCES "Mission"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Badge" ADD CONSTRAINT "Badge_mission_id_fkey" FOREIGN KEY ("mission_id") REFERENCES "Mission"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MissionAsset" ADD CONSTRAINT "MissionAsset_mission_id_fkey" FOREIGN KEY ("mission_id") REFERENCES "Mission"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MissionAsset" ADD CONSTRAINT "MissionAsset_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;
