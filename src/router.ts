import { Router } from "express";
import { authRoute } from "./modules/auth/auth.route";
const router = Router();

router.get("/", (req, res) => {
	res.send("Hello, World!");
});

router.use("/auth", authRoute);

export { router };
