import bcrypt from "bcrypt";
import { USER_ROLE } from "../types/role";
import { prisma } from "./prisma";

/**
 * seedAdmin - Idempotent script to ensure a primary administrator exists in the database.
 * Following best practices:
 * 1. Uses environment variables for credentials.
 * 2. Uses bcrypt for secure password hashing.
 * 3. Interacts directly with Prisma (independent of server state).
 * 4. Comprehensive logging and connection cleanup.
 */
const seedAdmin = async () => {
  const adminName = process.env.ADMIN_NAME;
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPass = process.env.ADMIN_PASS;

  // 1. Validate Environment Variables
  if (!adminName || !adminEmail || !adminPass) {
    console.error(
      "❌ Error: Missing required environment variables. Ensure ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASS are set in your .env file."
    );
    process.exit(1);
  }

  try {
    console.log(`🚀 Seeding admin: ${adminEmail}...`);

    // 2. Check if admin already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (existingUser) {
      console.log("ℹ️ User with this email already exists.");
      
      // Update role if necessary
      if (existingUser.role !== USER_ROLE.ADMIN) {
        await prisma.user.update({
          where: { email: adminEmail },
          data: { role: USER_ROLE.ADMIN, emailVerified: true },
        });
        console.log("✅ Existing user elevated to ADMIN role.");
      } else {
        console.log("✅ Admin user is already correctly configured.");
      }
      return;
    }

    // 3. Hash the password securely
    const hashedPassword = await bcrypt.hash(adminPass, 10);

    // 4. Create new admin directly via Prisma
    await prisma.user.create({
      data: {
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        role: USER_ROLE.ADMIN,
        emailVerified: true,
      },
    });

    console.log("✅ Admin user created successfully.");

  } catch (error) {
    console.error("❌ Failed to seed admin:", error);
    throw error;
  }
};

// Execute seeding
seedAdmin()
  .catch((error) => {
    console.error("💥 Fatal error during seeding:", error);
    process.exit(1);
  })
  .finally(async () => {
    // Ensure database connection is closed after execution
    await prisma.$disconnect();
    console.log("🔌 Database disconnected.");
  });