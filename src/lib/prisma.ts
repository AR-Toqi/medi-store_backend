import { Pool } from "pg";
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import { config } from "../config";


const connectionString = config.database_url;

if (!connectionString) {
  throw new Error("DATABASE_URL is missing. Cannot initialize Prisma.");
}

const pool = new Pool({
    connectionString,
    ssl: {
        rejectUnauthorized: false
    }
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
});

const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

export { prisma }