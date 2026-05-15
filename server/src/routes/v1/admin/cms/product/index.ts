import { Router } from "express";
import categoryRoutes from "./category.route";
import unitRoutes from "./unit.route";
import productRoutes from "./product.route";

const productRouter = Router();

productRouter.use("/category", categoryRoutes);
productRouter.use("/unit", unitRoutes);
productRouter.use("/", productRoutes);

export default productRouter;
