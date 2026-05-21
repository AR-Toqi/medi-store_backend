import { validateConfig } from "../dist/config";
import app from "../dist/app";

// Validate configuration on cold start
validateConfig();

// Export the Express app instance for Vercel serverless runtime
export default app;
