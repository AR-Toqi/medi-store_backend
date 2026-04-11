-- CreateEnum
CREATE TYPE "SellerStatus" AS ENUM ('ACTIVE', 'DISABLED');

-- AlterTable
ALTER TABLE "SellerProfile" ADD COLUMN     "status" "SellerStatus" NOT NULL DEFAULT 'ACTIVE';
