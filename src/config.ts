import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export const config = {
  // Use the PORT provided by the environment, but default to 10000 for local/production fallback.
  port: process.env.PORT || 10000,
  database_url: process.env.DATABASE_URL,
  better_auth_secret: process.env.BETTER_AUTH_SECRET,
  google_api_key: process.env.GOOGLE_API_KEY,
  better_auth_url: process.env.BETTER_AUTH_URL,
  app_url: process.env.APP_URL,
};

// Validation for critical variables — called explicitly from server.ts bootstrap
export function validateConfig() {
  // Database URL is strictly required for core database operations
  if (!config.database_url) {
    throw new Error('CRITICAL ERROR: DATABASE_URL is missing. The server cannot start without a database connection.');
  }

  // Better Auth variables - warn clearly but let the server start so Render health checks pass
  const authVars = [
    { name: 'BETTER_AUTH_SECRET', value: config.better_auth_secret },
    { name: 'BETTER_AUTH_URL', value: config.better_auth_url },
    { name: 'APP_URL', value: config.app_url },
  ];

  const missingAuth = authVars.filter(v => !v.value).map(v => v.name);

  if (missingAuth.length > 0) {
    console.warn('\n================================================================');
    console.warn(`WARNING: Missing authentication variables: ${missingAuth.join(', ')}`);
    console.warn('Authentication and OAuth features will not work correctly.');
    console.warn('Please define these in your Render dashboard environment variables!');
    console.warn('================================================================\n');
  }

  if (!config.google_api_key) {
    console.warn('WARNING: GOOGLE_API_KEY is missing. AI features will be unavailable.');
  }
}
