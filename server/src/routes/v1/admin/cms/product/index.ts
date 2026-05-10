import { Router } from "express";
import categoryRoutes from "./category.route";

const productRouter = Router();

productRouter.use("/category", categoryRoutes);

export default productRouter;
