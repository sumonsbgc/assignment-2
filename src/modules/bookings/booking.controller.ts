import { Request, Response } from "express";
import { bookingService } from "./booking.service";
import { IBooking, IUser } from "../../database/model";
import dayjs from "dayjs";
import { BookingStaus } from "../vehicles/booking.enum";
import { Roles } from "../auth/auth.constant";

class BookingController {
	async getBookings(req: Request, res: Response) {
		try {
			const user = req.user;
			if (!user) {
				return res.status(401).json({
					success: false,
					message: "Authentication required",
				});
			}

			const bookingsData = await bookingService.getBookings(
				user.role,
				Number(user.id)
			);

			if (bookingsData.rows.length === 0) {
				return res.status(200).json({
					success: true,
					message: "No bookings found",
					data: [],
				});
			}

			const allBookings = bookingsData.rows;
			let bookings: IBooking[] = [];
			if (user?.role === "customer") {
				bookings = allBookings.map((booking) => {
					const {
						customer_id,
						vehicle_name,
						registration_number,
						name,
						email,
						rent_start_date,
						rent_end_date,
						type,
						...rest
					} = booking;

					return {
						...rest,
						rent_start_date: dayjs(rent_start_date).format("YYYY-MM-DD"),
						rent_end_date: dayjs(rent_end_date).format("YYYY-MM-DD"),
						vehicle: {
							vehicle_name,
							registration_number,
							type,
						},
					};
				});
			}

			if (user?.role === "admin") {
				bookings = allBookings.map((booking) => {
					const {
						vehicle_name,
						registration_number,
						name,
						email,
						rent_start_date,
						rent_end_date,
						type,
						...rest
					} = booking;

					return {
						...rest,
						rent_start_date: dayjs(rent_start_date).format("YYYY-MM-DD"),
						rent_end_date: dayjs(rent_end_date).format("YYYY-MM-DD"),
						vehicle: {
							vehicle_name,
							registration_number,
						},
						customer: {
							name,
							email,
						},
					};
				});
			}

			return res.status(200).json({
				success: true,
				message: "Bookings retrieved successfully",
				data: bookings,
			});
		} catch (error: Error | any) {
			return res.status(500).json({
				success: false,
				message: "Failed to retrieve bookings",
				error: error.message,
			});
		}
	}
	async createBooking(req: Request, res: Response) {
		try {
			const booking = await bookingService.createBooking(req.body);

			if (!booking) {
				return res.status(400).json({
					success: false,
					message: "Failed to create booking",
					data: [],
				});
			}

			return res.status(201).json({
				success: true,
				message: "Booking created successfully",
				data: booking,
			});
		} catch (error: Error | any) {
			return res.status(500).json({
				success: false,
				message: "Booking creation failed",
				error: error.message,
			});
		}
	}
	async updateBooking(req: Request, res: Response) {
		try {
			const bookingId = req.params.bookingId;
			const { status } = req.body;
			const user = req.user as IUser;

			const result = await bookingService.updateBooking(
				status as BookingStaus,
				Number(bookingId),
				user
			);

			return res.status(200).json({
				success: true,
				message: `${
					user.role === Roles.admin
						? "Booking marked as returned. Vehicle is now available"
						: "Booking cancelled successfully"
				}`,
				data: result,
			});
		} catch (error: Error | any) {
			return res.status(500).json({
				success: false,
				message: "Booking update failed",
				error: error.message,
			});
		}
	}
}

const bookingController = new BookingController();
export { bookingController };
