import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { indexRoute } from "./routes";
import { notFound } from "./middlewares/notFound.middleware";
import globalErrorHandler from "./app/errors/globalErrorHandler";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";


const app: Application = express();

app.set("trust proxy", 1);

app.use(
  cors({
    origin: [process.env.APP_URL, process.env.BETTER_AUTH_URL] as string[],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


// Better Auth handler MUST be before express.json()
app.use("/api/auth", (req, res, next) => {
  // These are our custom routes that need to be handled by our auth.router.ts
  const customRoutes = [
    "/register", "/login", "/verify-email", "/logout", 
    "/refresh-token", "/forgot-password", "/reset-password", 
    "/login/google", "/google/success", "/oauth/error"
  ];
  
  // If the request matches a custom route, pass it to the next middleware (express.json and our router)
  if (customRoutes.includes(req.path)) {
    return next();
  }
  
  // Otherwise, let Better Auth handle it (e.g., /callback/google)
  return toNodeHandler(auth)(req, res);
});

app.use(cookieParser());
app.use(express.json());

app.get("/", (_, res) => {
  res.json({ status: "OK", message: "MediStore API running" });
});


app.use("/api", indexRoute);



//* Not found handler
app.use(notFound);

//* Global error handler
app.use(globalErrorHandler);

export default app;
