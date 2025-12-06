import { Router } from "express";
import { authController } from "./auth.controller";

const authRoute = Router();

authRoute.post("/signin", authController.signin);
authRoute.post("/signup", authController.signup);

export { authRoute };
