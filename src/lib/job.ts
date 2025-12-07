import dayjs from "dayjs";
import { pool } from "../database/db";
import cron from "node-cron";

const updateExpiredBookings = async () => {
	try {
		const today = dayjs().startOf("day").format("YYYY-MM-DD");
		console.log("Running updateExpiredBookings job for date:", today);

		const expiredBookingsResult = await pool.query(
			`UPDATE bookings 
       SET status = 'returned' 
       WHERE status = 'active' 
       AND rent_end_date < $1
       RETURNING id, vehicle_id`,
			[today]
		);

		console.log(`Expired bookings updated: ${expiredBookingsResult.rowCount}`);

		if (expiredBookingsResult.rows.length > 0) {
			const expiredBookings = expiredBookingsResult.rows;
			const vehiclesIds = [
				...new Set(expiredBookings.map((booking) => booking.vehicle_id)),
			];

			const result = await pool.query(
				`UPDATE vehicles SET availability_status = 'available' WHERE id = ANY($1) RETURNING *`,
				[vehiclesIds]
			);

			console.log(
				`Updated ${expiredBookings.length} expired bookings and ${result.rowCount} vehicles to available.`
			);
		}
	} catch (error) {
		console.error("Error updating expired bookings:", error);
	}
};

const startAutoReturnJob = () => {
	cron.schedule("0 0 * * *", async () => {
		await updateExpiredBookings();
	});

	updateExpiredBookings();
};

export { startAutoReturnJob };
