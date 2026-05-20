import app from './app';
import { config, validateConfig } from './config';
import { prisma } from './lib/prisma';

// --- Process-level error handlers ---
// IMPORTANT: Do NOT call process.exit() immediately — it kills the process
// before error messages can flush to Render's log collector.
process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION:', err.message);
    console.error(err.stack);
    // Give logs 1 second to flush before exiting
    setTimeout(() => process.exit(1), 1000);
});

process.on('unhandledRejection', (reason) => {
    // Log but do NOT exit — an unhandled rejection should not kill a running server.
    console.error('UNHANDLED REJECTION:', reason);
});

// --- Graceful shutdown ---
function gracefulShutdown(signal: string) {
    console.log(`Received ${signal}. Shutting down gracefully...`);
    prisma.$disconnect().finally(() => {
        process.exit(0);
    });
}
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));


async function main() {
    try {
        // Validate environment variables before doing anything else
        validateConfig();

        console.log('Starting Medistore Backend...');
        const port = Number(config.port);

        // 1. Start the server FIRST (so Render health check passes)
        const server = app.listen(port, "0.0.0.0", () => {
            console.log(`Server is running on port: ${port}`);
            console.log(`Ready to handle requests.`);
        });

        // Recommended by Render for 502 Bad Gateway issues
        server.keepAliveTimeout = 120000; // 120 seconds
        server.headersTimeout = 120000;

        // 2. Connect to database in the background
        console.log('Attempting to connect to database...');
        prisma.$connect()
            .then(() => {
                console.log('Database connected successfully');
            })
            .catch((err) => {
                console.error('DATABASE CONNECTION FAILED:', err);
                // We keep the server alive so you can see this error in the Render logs
            });

    } catch (error) {
        console.error('FATAL ERROR DURING BOOTSTRAP:', error);
        // Delay exit to allow logs to flush
        setTimeout(() => process.exit(1), 1000);
    }
}

main();