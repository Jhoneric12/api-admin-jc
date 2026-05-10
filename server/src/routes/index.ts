import { Router } from "express";
import v1Router from "./v1";

export const routes = Router();

routes.use("/v1", v1Router);
