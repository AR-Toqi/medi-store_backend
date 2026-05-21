import { validateConfig } from "../src/config";
import app from "../src/app";

// Validate configuration on cold start
validateConfig();

// Export the Express app instance for Vercel serverless runtime
export default app;
