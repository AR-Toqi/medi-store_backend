import { config } from "../config";
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'


const connectionString = config.database_url;

if (!connectionString) {
  throw new Error("DATABASE_URL is missing. Cannot initialize Prisma.");
}

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

export { prisma }