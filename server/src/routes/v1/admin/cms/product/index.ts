import { Router } from "express";
import categoryRoutes from "./category.route";
import unitRoutes from "./unit.route";

const productRouter = Router();

productRouter.use("/category", categoryRoutes);
productRouter.use("/unit", unitRoutes);

export default productRouter;
