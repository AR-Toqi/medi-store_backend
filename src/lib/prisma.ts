import { Pool, types } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client"
import { config } from "../config";

// Force Decimal types to be strings to avoid pg-driver parsing issues
types.setTypeParser(1700, (val) => val);

const connectionString = config.database_url;

const pool = new Pool({
    connectionString,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined,
});

// IMPORTANT: This prevents the "Application exited early" crash!
// It catches errors on idle clients so they don't bubble up and kill the process.
pool.on('error', (err) => {
    console.error('DATABASE POOL ERROR:', err.message);
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export { prisma };