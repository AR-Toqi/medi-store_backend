import { prisma } from "../../lib/prisma";
import { generateEmbedding } from "../../lib/embeddings";

/**
 * Script to generate embeddings for all medicines that don't have them.
 */
export const syncMedicineVectors = async () => {
  try {
    const medicines: any[] = await prisma.$queryRaw`
      SELECT id, name, description, manufacturer 
      FROM "Medicine" 
      WHERE vector IS NULL
    `;

    for (const medicine of medicines) {
      try {
        // Create a descriptive prompt for the embedding
        const prompt = `title: ${medicine.name} | description: ${medicine.description || ""} | manufacturer: ${medicine.manufacturer}`;
        
        const vector = await generateEmbedding(prompt, { 
          taskType: "search_document",
          title: medicine.name 
        });

        // Update using raw SQL since Prisma doesn't support vector types natively
        const vectorString = `[${vector.join(",")}]`;
        await prisma.$executeRawUnsafe(`
          UPDATE "Medicine"
          SET vector = '${vectorString}'::vector
          WHERE id = '${medicine.id}'
        `);

      } catch (err) {
        // Silently continue for individual failures
      }
    }
  } catch (error) {
    // Critical error caught
  }
};

// Run if called directly
import { fileURLToPath } from 'url';

const isMain = process.argv[1] && (process.argv[1] === fileURLToPath(import.meta.url));

if (isMain) {
  syncMedicineVectors()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
