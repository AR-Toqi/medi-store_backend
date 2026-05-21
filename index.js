import { validateConfig } from "./dist/config.js";
import app from "./dist/app.js";

// Validate configuration on cold start
validateConfig();

// Export the Express app instance for Vercel serverless runtime
export default app;
