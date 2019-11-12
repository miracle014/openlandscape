import express from "express";
import VMController from "../controllers/vmControllers";

var authRouter = express.Router();
var appVM = new VMController();

authRouter.get("/", appVM.findAll);
authRouter.get("/:id", appVM.findById);
authRouter.get("/find/all", appVM.findDataAll);
authRouter.get("/download/csv", appVM.downloadCSV);
export default authRouter;
