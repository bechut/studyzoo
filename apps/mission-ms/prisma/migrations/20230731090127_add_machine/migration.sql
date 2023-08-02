-- CreateEnum
CREATE TYPE "MachineType" AS ENUM ('BINOCULAR', 'OUTPOST');

-- CreateEnum
CREATE TYPE "MachineStatus" AS ENUM ('USED', 'AVAILABLE');

-- CreateTable
CREATE TABLE "Machine" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "code" VARCHAR(255) NOT NULL,
    "type" "MachineType" NOT NULL,
    "status" "MachineStatus" NOT NULL,
    "player_id" TEXT NOT NULL,

    CONSTRAINT "Machine_pkey" PRIMARY KEY ("id")
);
