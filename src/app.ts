import express, { Application} from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";

const app: Application = express();


app.all("/api/auth/*", toNodeHandler(auth));
app.use(cors());
app.use(express.json());

app.get("/", (_, res) => {
  res.json({ status: "OK", message: "MediStore API running" });
});

export default app;
