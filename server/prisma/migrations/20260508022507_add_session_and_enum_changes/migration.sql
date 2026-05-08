/*
  Warnings:

  - The values [cosmetics] on the enum `Category` will be removed. If these variants are still used in the database, this will fail.
  - The values [null] on the enum `RepurchaseChoice` will be removed. If these variants are still used in the database, this will fail.
  - Made the column `header` on table `Profile` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Category_new" AS ENUM ('skincare', 'makeup');
ALTER TABLE "Inventory" ALTER COLUMN "category" TYPE "Category_new" USING ("category"::text::"Category_new");
ALTER TYPE "Category" RENAME TO "Category_old";
ALTER TYPE "Category_new" RENAME TO "Category";
DROP TYPE "public"."Category_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "RepurchaseChoice_new" AS ENUM ('na', 'no', 'yes', 'maybe', 'ifItWasGifted');
ALTER TABLE "public"."Inventory" ALTER COLUMN "wouldBuyAgain" DROP DEFAULT;
ALTER TABLE "Inventory" ALTER COLUMN "wouldBuyAgain" TYPE "RepurchaseChoice_new" USING ("wouldBuyAgain"::text::"RepurchaseChoice_new");
ALTER TYPE "RepurchaseChoice" RENAME TO "RepurchaseChoice_old";
ALTER TYPE "RepurchaseChoice_new" RENAME TO "RepurchaseChoice";
DROP TYPE "public"."RepurchaseChoice_old";
ALTER TABLE "Inventory" ALTER COLUMN "wouldBuyAgain" SET DEFAULT 'na';
COMMIT;

-- AlterTable
ALTER TABLE "Inventory" ALTER COLUMN "rating" SET DATA TYPE TEXT,
ALTER COLUMN "wouldBuyAgain" SET DEFAULT 'na';

-- AlterTable
ALTER TABLE "Posts" ALTER COLUMN "img" SET DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "Profile" ALTER COLUMN "header" SET NOT NULL,
ALTER COLUMN "header" SET DEFAULT 'white';

-- CreateTable
CREATE TABLE "session" (
    "sid" VARCHAR NOT NULL,
    "sess" JSON NOT NULL,
    "expire" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
);

-- CreateIndex
CREATE INDEX "IDX_session_expire" ON "session"("expire");
