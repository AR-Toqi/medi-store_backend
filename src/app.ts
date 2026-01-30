import express, { Application} from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { userRoutes } from "./modules/user/user.router";
import { categoryRoutes } from "./modules/categories/categories.router";
import { sellerProfileRoutes } from "./modules/sellerProfile/sellerProfile.router";
import { medicineRoutes } from "./modules/medicine/medicine.router";
import { orderRoutes } from "./modules/order/order.router";

const app: Application = express();

app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(cors(
  {
    origin: process.env.APP_URL,
    credentials: true
  }
));
app.use(express.json());

app.use("/api/auth", userRoutes);

app.use("/api", categoryRoutes);

app.use("/api/sellers", sellerProfileRoutes);

app.use("/api/medicines", medicineRoutes);
app.use("/api/orders", orderRoutes);

app.use("/api/seller", medicineRoutes);
app.use("/api/seller", orderRoutes);

app.use("/api/admin", orderRoutes);
app.use("/api/admin", categoryRoutes);
app.use("/api/admin", sellerProfileRoutes);

app.get("/", (_, res) => {
  res.json({ status: "OK", message: "MediStore API running" });
});

export default app;
