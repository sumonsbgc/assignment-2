import { Router } from "express";
import { bookingController } from "./booking.controller";
import { authorize } from "../../middleware/authorize";
import { verifyBooking } from "../../middleware/verifyBooking";

const bookingRouter = Router();

bookingRouter.get(
	"/",
	authorize("admin", "customer"),
	bookingController.getBookings
);

bookingRouter.post(
	"/",
	authorize("admin", "customer"),
	bookingController.createBooking
);

bookingRouter.put(
	"/:bookingId",
	authorize("admin", "customer"),
	verifyBooking,
	bookingController.updateBooking
);

export { bookingRouter };
