import { Router } from "express";
import { authRoute } from "./modules/auth/auth.route";
import { userRouter } from "./modules/users/user.route";
import { authenticate } from "./middleware/authenticate";
import { vehicleRouter } from "./modules/vehicles/vehicle.route";
import { bookingRouter } from "./modules/bookings/booking.route";
const router = Router();

router.get("/", (req, res) => {
	res.send("Hello, World!");
});

router.use("/auth", authRoute);
router.use("/users", authenticate(), userRouter);
router.use("/vehicles", vehicleRouter);
router.use("/bookings", authenticate(), bookingRouter);

export { router };
