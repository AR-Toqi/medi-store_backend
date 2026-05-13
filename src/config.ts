import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export const config = {
  port: process.env.PORT || 5000,
  database_url: process.env.DATABASE_URL,
  node_env: process.env.NODE_ENV,
  better_auth_secret: process.env.BETTER_AUTH_SECRET,
  better_auth_url: process.env.BETTER_AUTH_URL,
  app_url: process.env.APP_URL,
  admin_email: process.env.ADMIN_EMAIL,
  admin_name: process.env.ADMIN_NAME,
  admin_pass: process.env.ADMIN_PASS,
  google_api_key: process.env.GOOGLE_API_KEY,
  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
};

// Validation for critical variables
const requiredVars = [
  { name: 'DATABASE_URL', value: config.database_url },
  { name: 'BETTER_AUTH_SECRET', value: config.better_auth_secret },
  { name: 'GOOGLE_API_KEY', value: config.google_api_key },
];

console.log("--- Environment Validation ---");
requiredVars.forEach(v => {
  if (!v.value) {
    console.warn(`MISSING: ${v.name} is not defined!`);
  } else {
    console.log(`OK: ${v.name} is present`);
  }
});
console.log("------------------------------");
