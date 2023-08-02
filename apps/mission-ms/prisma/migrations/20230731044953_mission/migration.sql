-- CreateTable
CREATE TABLE "Mission" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(16) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "videoUrl" VARCHAR(255) NOT NULL,
    "mapImage" VARCHAR(255) NOT NULL,
    "mapImageUrl" VARCHAR(255) NOT NULL,
    "duration" VARCHAR(32) NOT NULL,
    "distance" VARCHAR(32) NOT NULL,
    "description" TEXT NOT NULL,
    "startsFrom" TIMESTAMPTZ NOT NULL,
    "endsOn" TIMESTAMPTZ NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastModified" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "Mission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Mission_code_key" ON "Mission"("code");
