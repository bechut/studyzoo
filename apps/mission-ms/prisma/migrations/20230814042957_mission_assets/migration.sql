/*
  Warnings:

  - You are about to drop the column `mapImage` on the `Mission` table. All the data in the column will be lost.
  - You are about to drop the column `mapImageUrl` on the `Mission` table. All the data in the column will be lost.
  - You are about to drop the column `video` on the `Mission` table. All the data in the column will be lost.
  - You are about to drop the column `videoUrl` on the `Mission` table. All the data in the column will be lost.
  - You are about to drop the `MissionAssets` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Mission" DROP COLUMN "mapImage",
DROP COLUMN "mapImageUrl",
DROP COLUMN "video",
DROP COLUMN "videoUrl";

-- DropTable
DROP TABLE "MissionAssets";

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

    CONSTRAINT "MissionAsset_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MissionAsset" ADD CONSTRAINT "MissionAsset_mission_id_fkey" FOREIGN KEY ("mission_id") REFERENCES "Mission"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MissionAsset" ADD CONSTRAINT "MissionAsset_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;
