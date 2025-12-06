import { Router } from "express";
import { userController } from "./user.controller";
import { authorize } from "../../middleware/authorize";
import { verifyUser } from "../../middleware/verifyUser";

const userRouter = Router();

userRouter.get("/", authorize("admin"), userController.getUsers);
userRouter.put(
	"/:userId",
	authorize("admin", "customer"),
	verifyUser,
	userController.updateUser
);

userRouter.delete("/:userId", authorize("admin"), userController.deleteUser);

export { userRouter };
