import "dotenv/config";
import app from "./app";
import { prisma } from "./lib/prisma";

const PORT = process.env.PORT || 5000;
async function main() {
    try {
        await prisma.$connect();

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        })
    } catch (error) {
        console.error("FATAL: Failed to start server:", error);
        process.exit(1);
    }
};

console.log("Starting MediStore Backend...");

main().catch(err => {
    console.error("CRITICAL: Unhandled error during startup:", err);
    process.exit(1);
});