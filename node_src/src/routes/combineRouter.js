import express from "express";

import uploadRoutes from "./uploadRoutes";
import authRoutes from "./authRoutes";

var routes = express.Router();

routes.use("/uploads", uploadRoutes);
routes.use("/auth", authRoutes);

export default routes;
