import { prisma } from "../../lib/prisma";
import { generateEmbedding } from "../../lib/embeddings";

/**
 * Script to generate embeddings for all medicines that don't have them.
 */
export const syncMedicineVectors = async () => {
  console.log("Starting medicine vector synchronization...");
  
  try {
    const medicines: any[] = await prisma.$queryRaw`
      SELECT id, name, description, manufacturer 
      FROM "Medicine" 
      WHERE vector IS NULL
    `;

    console.log(`Found ${medicines.length} medicines needing vectors.`);

    for (const medicine of medicines) {
      try {
        console.log(`Generating embedding for: ${medicine.name}`);
        
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

        console.log(`Successfully updated vector for: ${medicine.name}`);
      } catch (err) {
        console.error(`Failed to update vector for ${medicine.name}:`, err);
      }
    }

    console.log("Synchronization complete!");
  } catch (error) {
    console.error("Critical error during synchronization:", error);
  }
};

// Run if called directly
if (require.main === module) {
  syncMedicineVectors()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
