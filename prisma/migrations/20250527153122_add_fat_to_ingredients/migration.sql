/*
  Warnings:

  - Added the required column `fat` to the `ingredients` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ingredients" ADD COLUMN     "fat" DOUBLE PRECISION NOT NULL;
