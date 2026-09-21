-- AlterTable
ALTER TABLE "Facility" ADD COLUMN     "gallery" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "Treatment" ADD COLUMN     "gallery" TEXT[] DEFAULT ARRAY[]::TEXT[];
