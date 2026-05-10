import { Router } from "express";
import authRoutes from "./admin/auth/auth.route";
import productRoutes from "./admin/cms/product/index";

const v1Router = Router();

v1Router.use("/auth", authRoutes);
v1Router.use("/product", productRoutes);

export default v1Router;
