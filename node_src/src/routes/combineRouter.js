import express from "express";

import uploadRoutes from "./uploadRoutes";
import authRoutes from "./authRoutes";
import vmRoutes from "./vmRoutes";

var routes = express.Router();

routes.use("/uploads", uploadRoutes);
routes.use("/auth", authRoutes);
routes.use("/vm", vmRoutes);

export default routes;
