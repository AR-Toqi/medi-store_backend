console.log(">>> [BOOT] 1. Starting process...");

import "dotenv/config";
console.log(">>> [BOOT] 2. Dotenv loaded");

import { config } from "./config";
console.log(">>> [BOOT] 3. Config loaded");

import app from "./app";
console.log(">>> [BOOT] 4. App loaded");

import { prisma } from "./lib/prisma";
console.log(">>> [BOOT] 5. Prisma loaded");

const PORT = config.port || 5000;

async function main() {
    console.log(">>> [BOOT] 6. Entering main()");
    try {
        await prisma.$connect();
        console.log(">>> [BOOT] 7. Database connected successfully");

        app.listen(PORT, () => {
            console.log(`>>> [BOOT] 8. Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("FATAL: Failed to start server:", error);
        process.exit(1);
    }
}

main().catch(err => {
    console.error("CRITICAL: Unhandled error during startup:", err);
    process.exit(1);
});