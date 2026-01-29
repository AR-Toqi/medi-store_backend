import { USER_ROLE } from "../types/role";
import { auth } from "./auth";
import { prisma } from "./prisma";

const seedAdmin = async () => {
  const adminData = {
    name: process.env.ADMIN_NAME as string,
    email: process.env.ADMIN_EMAIL as string,
    password: process.env.ADMIN_PASS as string,
    role: USER_ROLE.ADMIN
  };

  try {
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminData.email },
    });

    if (existingAdmin) {
      throw new Error("Admin user already exists");
    }
      // Create new admin
      const signUpAdmin = await fetch("http://localhost:5000/api/auth/sign-up/email",{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Origin": "http://localhost:3000"
        },
        body: JSON.stringify(adminData),
      })
      console.log(signUpAdmin);
    

    if (signUpAdmin.ok){

      await prisma.user.update({
        where: { email: adminData.email },
        data: {
          emailVerified: true
        },
      });
      console.log(" Admin user updated with correct role and status");
    }

  } catch (error) {
    console.error(" Failed to seed admin:", error);
    throw error;
  }
};

seedAdmin()
  .catch((error) => {
    console.error("Fatal error during seeding:", error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());