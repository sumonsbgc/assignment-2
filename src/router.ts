import { Router } from "express";
import { authRoute } from "./modules/auth/auth.route";
import { userRouter } from "./modules/users/user.route";
import { authenticate } from "./middleware/authenticate";
const router = Router();

router.get("/", (req, res) => {
	res.send("Hello, World!");
});

router.use("/auth", authRoute);
router.use("/users", authenticate(), userRouter);

export { router };
