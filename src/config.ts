import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export const config = {
  port: process.env.PORT || 5000,
  database_url: process.env.DATABASE_URL,
  better_auth_secret: process.env.BETTER_AUTH_SECRET,
  google_api_key: process.env.GOOGLE_API_KEY,
};

// Validation for critical variables
const requiredVars = [
  { name: 'DATABASE_URL', value: config.database_url },
  { name: 'BETTER_AUTH_SECRET', value: config.better_auth_secret },
  { name: 'GOOGLE_API_KEY', value: config.google_api_key },
];

requiredVars.forEach(v => {
  if (!v.value) {
    throw new Error(`CRITICAL ERROR: Environment variable ${v.name} is missing. The server cannot start without it.`);
  }
});
