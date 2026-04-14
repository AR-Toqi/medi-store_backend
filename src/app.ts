import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { indexRoute } from "./routes";
import { notFound } from "./middlewares/notFound.middleware";
import globalErrorHandler from "./app/errors/globalErrorHandler";

const app: Application = express();

app.use(
  cors({
    origin: [process.env.APP_URL, process.env.BETTER_AUTH_URL] as string[],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
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
