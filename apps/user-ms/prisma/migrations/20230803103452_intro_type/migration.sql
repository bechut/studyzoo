/*
  Warnings:

  - A unique constraint covering the columns `[order,type]` on the table `Intro` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Intro" ADD COLUMN     "order" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Intro_order_type_key" ON "Intro"("order", "type");
