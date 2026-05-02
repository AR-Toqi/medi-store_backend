-- Resize the vector column to 3072 dimensions
ALTER TABLE "Medicine" ALTER COLUMN "vector" TYPE vector(3072);
