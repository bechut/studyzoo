/*
  Warnings:

  - A unique constraint covering the columns `[player_id]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "player_id" TEXT;

-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_player_id_key" ON "Profile"("player_id");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
