import "dotenv/config";
import app from "./app";
import { prisma } from "./lib/prisma";
import { config } from "./config";

process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason);
    process.exit(1);
});

const PORT = config.port || 5000;

async function bootstrap() {
    try {
        // Database connection
        await prisma.$connect();

        // Start server
        const server = app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });

        // Handle process signals for graceful shutdown
        const exitHandler = () => {
            if (server) {
                server.close(() => {
                    process.exit(1);
                });
            } else {
                process.exit(1);
            }
        };

        process.on("uncaughtException", exitHandler);
        process.on("unhandledRejection", exitHandler);

    } catch (error) {
        process.exit(1);
    }
}

bootstrap();