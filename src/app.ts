import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authRoutes } from "./modules/auth/auth.router";
import { userRoutes } from "./modules/user/user.router";
import { categoryRoutes } from "./modules/categories/categories.router";
import { sellerProfileRoutes } from "./modules/sellerProfile/sellerProfile.router";
import { medicineRoutes } from "./modules/medicine/medicine.router";
import { orderRoutes } from "./modules/order/order.router";
import { sellerRoutes } from "./modules/seller/seller.router";
import { cartItemRoutes } from "./modules/cartItem/cartItem.router";
import { reviewRoutes } from "./modules/reviews/reviews.router";
import { adminRoutes } from "./modules/admin/admin.router";
import { addressRoutes } from "./modules/address/address.router";
import { notFound } from "./middlewares/notFound.middleware";
import globalErrorHandler from "./app/errors/globalErrorHandler";

const app: Application = express();

app.use(
  cors({
    origin: process.env.APP_URL,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

app.get("/", (_, res) => {
  res.json({ status: "OK", message: "MediStore API running" });
});

app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/medicines", medicineRoutes);
app.use("/api/sellers", sellerProfileRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartItemRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/admin", adminRoutes);

//* Not found handler
app.use(notFound);

//* Global error handler
app.use(globalErrorHandler);

export default app;
