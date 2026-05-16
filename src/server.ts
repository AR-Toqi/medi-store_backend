process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION - THE SERVER IS CRASHING:', err.message);
    console.error(err.stack);
    process.exit(1);
});

process.on('unhandledRejection', (reason) => {
    console.error('UNHANDLED REJECTION:', reason);
    process.exit(1);
});

// const PORT = config.port || 5000;

// async function bootstrap() {
//     try {
//         // Database connection
//         await prisma.$connect();

//         // Start server
//         const server = app.listen(PORT, () => {
//             console.log(`Server is running on port ${PORT}`);
//         });

//         // Handle process signals for graceful shutdown
//         const exitHandler = (error: any) => {
//             console.error('Unhandled exception or rejection:', error);
//             if (server) {
//                 server.close(() => {
//                     process.exit(1);
//                 });
//             } else {
//                 process.exit(1);
//             }
//         };

//         process.on("uncaughtException", exitHandler);
//         process.on("unhandledRejection", exitHandler);

//     } catch (error) {
//         console.error('Bootstrap failed:', error);
//         process.exit(1);
//     }
// }

// bootstrap();

import app from './app';
import { config } from './config';
import { prisma } from './lib/prisma';


async function main() {
    try {
        console.log('Starting Medistore Backend...');
        const port = Number(config.port);

        // 1. Start the server FIRST (so Render health check passes)
        app.listen(port, "0.0.0.0", () => {
            console.log(`Server is running on port: ${port}`);
            console.log(`Ready to handle requests.`);
        });

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
        process.exit(1);
    }
}

main();