import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export const config = {
  // Use the PORT provided by the environment, but default to 10000 for Render compatibility.
  // We explicitly ignore '5000' if it comes from a local .env override.
  port: (process.env.PORT && process.env.PORT !== "5000") ? process.env.PORT : 10000,
  database_url: process.env.DATABASE_URL,
  better_auth_secret: process.env.BETTER_AUTH_SECRET,
  google_api_key: process.env.GOOGLE_API_KEY,
  better_auth_url: process.env.BETTER_AUTH_URL,
  app_url: process.env.APP_URL,
};

// Validation for critical variables
const requiredVars = [
  { name: 'DATABASE_URL', value: config.database_url },
  { name: 'BETTER_AUTH_SECRET', value: config.better_auth_secret },
  { name: 'GOOGLE_API_KEY', value: config.google_api_key },
  { name: 'BETTER_AUTH_URL', value: config.better_auth_url },
  { name: 'APP_URL', value: config.app_url },
];

requiredVars.forEach(v => {
  if (!v.value) {
    throw new Error(`CRITICAL ERROR: Environment variable ${v.name} is missing. The server cannot start without it.`);
  }
});
