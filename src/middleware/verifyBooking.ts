import { NextFunction, Request, Response } from "express";
import { bookingService } from "../modules/bookings/booking.service";

const verifyBooking = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const user = req.user;
		console.log(user, "user in verifyBooking middleware");

		if (!user) {
			return res.status(401).json({
				success: false,
				message: "Authentication required",
			});
		}

		if (user.role === "admin") {
			return next();
		}

		const requestedBookingId = String(req.params.bookingId);
		const bookingData = await bookingService.getBookingById(requestedBookingId);

		if (
			bookingData.rows.length === 0 ||
			String(bookingData.rows[0].customer_id) !== String(user.id)
		) {
			return res.status(403).json({
				success: false,
				message: "You are not authorized to access this resource",
			});
		}

		return next();
	} catch (error: Error | any) {
		return res.status(500).json({
			success: false,
			message: "Internal Server Error",
			error: (error as Error).message,
		});
	}
};

export { verifyBooking };
