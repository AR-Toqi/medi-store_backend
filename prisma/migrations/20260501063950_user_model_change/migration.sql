-- AlterTable
ALTER TABLE "user" ADD COLUMN     "isDeleted" BOOLEAN DEFAULT false,
ADD COLUMN     "needsPasswordChange" BOOLEAN DEFAULT false,
ADD COLUMN     "status" TEXT DEFAULT 'ACTIVE';
