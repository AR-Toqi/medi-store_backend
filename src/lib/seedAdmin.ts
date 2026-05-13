import { USER_ROLE } from "../types/role";
import { prisma } from "./prisma";
import { auth } from "./auth";

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

    // 2. Check if admin already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (existingUser) {
      
      // Update role if necessary
      if (existingUser.role !== USER_ROLE.ADMIN) {
        await prisma.user.update({
          where: { email: adminEmail },
          data: { role: USER_ROLE.ADMIN, emailVerified: true },
        });
      } else {
      }
      return;
    }

    // 3. Create new admin via Better Auth API
    // This ensures that the Account record (required for login) is also created
    const result = await auth.api.signUpEmail({
      body: {
        name: adminName,
        email: adminEmail,
        password: adminPass,
      },
    });

    if (result && result.user) {
      // 4. Update the user to set ADMIN role and mark as verified
      await prisma.user.update({
        where: { id: result.user.id },
        data: {
          role: USER_ROLE.ADMIN,
          emailVerified: true,
        },
      });
    }

  } catch (error) {
    throw error;
  }
};

// Execute seeding
seedAdmin()
  .catch((error) => {
    process.exit(1);
  })
  .finally(async () => {
    // Ensure database connection is closed after execution
    await prisma.$disconnect();
  });