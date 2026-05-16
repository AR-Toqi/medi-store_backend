// import "dotenv/config";
// import app from "./app";
// import { prisma } from "./lib/prisma";
// import { config } from "./config";

// process.on('unhandledRejection', (reason) => {
//     console.error('Unhandled Rejection:', reason);
//     process.exit(1);
// });

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
        
        // Check database connection
        console.log('Attempting to connect to database...');
        await prisma.$connect();
        console.log('Database connected successfully');

        const port = Number(config.port);
        app.listen(port, "0.0.0.0", () => {
            console.log(`Server is running on port: ${port}`);
            console.log(`Ready to handle requests.`);
        });

    } catch (error) {
        console.error('FATAL ERROR DURING BOOTSTRAP:', error);
        process.exit(1);
    }
}

main();