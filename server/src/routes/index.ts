import { Router } from "express";

// V1 ROUTES
import AuthRoutes from "./v1/auth.route";

export const routes = Router();

routes.use("/v1", AuthRoutes);
