import express from "express";
import AuthenController from "../controllers/authenControllers";

var authRouter = express.Router();
var appClientAuth = new AuthenController();

authRouter.post("/token/admin", appClientAuth.adminAuthen);
authRouter.post("/token/sectionMananger", appClientAuth.sectionManagerAuthen);

export default authRouter;
