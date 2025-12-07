import dayjs from "dayjs";
import { pool } from "../../database/db";
import { IBooking, IUser } from "../../database/model";
import { vehicleService } from "../vehicles/vehicle.service";
import { calculateTotalPrice } from "./helper";
import { userService } from "../users/user.service";
import { IRoles, Roles } from "../auth/auth.constant";
import { BookingStaus } from "../vehicles/booking.enum";

/* 
{
  "customer_id": 1,
  "vehicle_id": 2,
  "rent_start_date": "2024-01-15",
  "rent_end_date": "2024-01-20"
}

	// customer_id: number;
	// vehicle_id: number;
	// rent_start_date: Date;
	// rent_end_date: Date;
	// total_price: number;
	// status: string;

  Create booking with start/end dates
• Validates vehicle availability
• Calculates total price (daily rate × duration)
• Updates vehicle status to "booked"
*/

type IBookingPayload = {
	customer_id: number;
	vehicle_id: number;
	rent_start_date: Date;
	rent_end_date: Date;
};

const getBookings = (role: IRoles, customerId: number) => {
	if (role === Roles.admin) {
		return pool.query(
			"SELECT bookings.id, bookings.customer_id, bookings.vehicle_id, bookings.rent_start_date, bookings.rent_end_date, bookings.total_price, bookings.status, users.name, users.email, vehicles.vehicle_name, vehicles.registration_number, vehicles.type FROM bookings JOIN users ON bookings.customer_id = users.id JOIN vehicles ON bookings.vehicle_id = vehicles.id"
		);
	}

	return pool.query(
		"SELECT bookings.id, bookings.customer_id, bookings.vehicle_id, bookings.rent_start_date, bookings.rent_end_date, bookings.total_price, bookings.status, users.name, users.email, vehicles.vehicle_name, vehicles.registration_number, vehicles.type FROM bookings JOIN users ON bookings.customer_id = users.id JOIN vehicles ON bookings.vehicle_id = vehicles.id WHERE bookings.customer_id = $1",
		[customerId]
	);
};

const getBookingsByCustomerId = (customerId: number) => {
	const result = pool.query("SELECT * FROM bookings WHERE customer_id = $1", [
		customerId,
	]);

	return result;
};

const getActiveBookingsByVehicleId = (vehicleId: number) => {
	const result = pool.query(
		"SELECT * FROM bookings WHERE vehicle_id = $1 AND status = 'active'",
		[vehicleId]
	);
	return result;
};

const getActiveBookingsByCustomerId = (customerId: number) => {
	const result = pool.query(
		"SELECT * FROM bookings WHERE customer_id = $1 AND status = 'active'",
		[customerId]
	);

	return result;
};

const getBookingById = (bookingId: string) => {
	const result = pool.query("SELECT * FROM bookings WHERE id = $1", [
		bookingId,
	]);
	return result;
};

const createBooking = async (data: IBookingPayload) => {
	const vehicle = await vehicleService.getActiveVehicleById(data.vehicle_id);

	const totalPrice = calculateTotalPrice(
		data.rent_start_date,
		data.rent_end_date,
		Number(vehicle.daily_rent_price)
	);

	const bookingData = await insertBooking({
		customer_id: data.customer_id,
		vehicle_id: data.vehicle_id,
		rent_start_date: data.rent_start_date,
		rent_end_date: data.rent_end_date,
		total_price: totalPrice,
		status: "active",
	});

	if (bookingData.rows.length === 0) {
		throw new Error("Failed to create booking");
	}
	const booking = bookingData.rows[0];

	const updatedVehicle = await vehicleService.updateVehicle(
		String(data.vehicle_id),
		{
			vehicle_name: vehicle.vehicle_name,
			type: vehicle.type,
			registration_number: vehicle.registration_number,
			daily_rent_price: Number(vehicle.daily_rent_price),
			availability_status: "booked",
		}
	);

	if (updatedVehicle.rows.length === 0) {
		throw new Error("Failed to update vehicle status");
	}

	const updateVeh = updatedVehicle.rows[0];

	const updatedBooking = {
		...booking,
		rent_start_date: dayjs(booking.rent_start_date).format("YYYY-MM-DD"),
		rent_end_date: dayjs(booking.rent_end_date).format("YYYY-MM-DD"),
		vehicle: {
			vehicle_name: updateVeh.vehicle_name,
			daily_rent_price: updateVeh.daily_rent_price,
		},
	};

	return updatedBooking;
};

const insertBooking = async (bookingData: IBooking) => {
	const result = await pool.query(
		`INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) 
     VALUES ($1, $2, $3, $4, $5, $6) 
     RETURNING id, customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status`,
		[
			bookingData.customer_id,
			bookingData.vehicle_id,
			dayjs(bookingData.rent_start_date).format("YYYY-MM-DD"),
			dayjs(bookingData.rent_end_date).format("YYYY-MM-DD"),
			bookingData.total_price,
			bookingData.status,
		]
	);

	return result;
};

/* 
  Customer: Cancel booking (before start date only)
Admin: Mark as "returned" (updates vehicle to "available")
System: Auto-mark as "returned" when period end
*/

const updateBooking = async (
	status: BookingStaus,
	bookingId: number,
	user: IUser
) => {
	if (status === BookingStaus.cancelled) {
		const bookingData = await getBookingById(String(bookingId));

		if (bookingData.rows.length === 0) {
			throw new Error("Booking not found");
		}

		const booking = bookingData.rows[0];
		if (dayjs().isBefore(dayjs(booking.rent_start_date))) {
			const result = await pool.query(
				`UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *`,
				[status, bookingId]
			);

			if (result.rows.length === 0) {
				throw new Error("Failed to update booking status");
			}
			const booking = result.rows[0];

			const vehicleUpdate = await pool.query(
				`UPDATE vehicles SET availability_status = 'available' WHERE id = $1 RETURNING *`,
				[booking.vehicle_id]
			);

			if (vehicleUpdate.rows.length === 0) {
				throw new Error("Failed to update vehicle status");
			}

			const data = {
				id: booking.id,
				customer_id: booking.customer_id,
				vehicle_id: booking.vehicle_id,
				rent_start_date: dayjs(booking.rent_start_date).format("YYYY-MM-DD"),
				rent_end_date: dayjs(booking.rent_end_date).format("YYYY-MM-DD"),
				total_price: booking.total_price,
				status: booking.status,
			};

			return data;
		} else {
			throw new Error("Cannot cancel booking after rent start date");
		}
	}

	if (status === BookingStaus.returned && user.role === Roles.admin) {
		const result = await pool.query(
			`UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *`,
			[status, bookingId]
		);

		if (result.rows.length === 0) {
			throw new Error("Failed to update booking status");
		}

		const booking = result.rows[0];

		const vehicleUpdate = await pool.query(
			`UPDATE vehicles SET availability_status = 'available' WHERE id = $1 RETURNING *`,
			[booking.vehicle_id]
		);

		if (vehicleUpdate.rows.length === 0) {
			throw new Error("Failed to update vehicle status");
		}

		const vehicle = vehicleUpdate.rows[0];

		const data = {
			id: booking.id,
			customer_id: booking.customer_id,
			vehicle_id: booking.vehicle_id,
			rent_start_date: dayjs(booking.rent_start_date).format("YYYY-MM-DD"),
			rent_end_date: dayjs(booking.rent_end_date).format("YYYY-MM-DD"),
			total_price: booking.total_price,
			status: booking.status,
			vehicle: {
				availability_status: vehicle.availability_status,
			},
		};

		return data;
	}
};

export const bookingService = {
	getBookings,
	getBookingsByCustomerId,
	getActiveBookingsByCustomerId,
	getActiveBookingsByVehicleId,
	getBookingById,
	createBooking,
	updateBooking,
};
