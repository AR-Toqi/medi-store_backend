import { PrismaClient } from '@prisma/client'
import { config } from "../config";

const connectionString = config.database_url;

if (!connectionString) {
  throw new Error("DATABASE_URL is missing. Cannot initialize Prisma.");
}

const prisma = new PrismaClient();

export { prisma }