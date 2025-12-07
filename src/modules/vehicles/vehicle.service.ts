import { pool } from "../../database/db";
import { IVehicle } from "../../database/model";

const getVehicles = async () => {
	const result = await pool.query("SELECT * FROM vehicles");
	return result;
};

const createVehicle = async (data: IVehicle) => {
	const result = await pool.query(
		`INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
		[
			data.vehicle_name,
			data.type,
			data.registration_number,
			data.daily_rent_price,
			data.availability_status,
		]
	);

	return result;
};

const getVehicleById = async (vehicleId: string) => {
	const result = await pool.query(
		"SELECT id, vehicle_name, type, registration_number, daily_rent_price, availability_status FROM vehicles WHERE id = $1",
		[vehicleId]
	);
	return result;
};

export const getActiveVehicleById = async (vehicleId: number) => {
	const result = await pool.query(
		"SELECT * FROM vehicles WHERE availability_status = 'available' AND id = $1",
		[vehicleId]
	);

	if (result.rows.length === 0) {
		throw new Error("Vehicle is not available");
	}

	return result.rows[0];
};

const updateVehicle = async (vehicleId: string, data: IVehicle) => {
	const result = await pool.query(
		`UPDATE vehicles SET vehicle_name = $1, type = $2, registration_number = $3, daily_rent_price = $4, availability_status = $5 WHERE id = $6 RETURNING *`,
		[
			data.vehicle_name,
			data.type,
			data.registration_number,
			data.daily_rent_price,
			data.availability_status,
			vehicleId,
		]
	);

	return result;
};

const deleteVehicle = async (vehicleId: string) => {
	const result = await pool.query("DELETE FROM vehicles WHERE id = $1", [
		vehicleId,
	]);
	return result;
};

export const vehicleService = {
	getVehicles,
	createVehicle,
	getVehicleById,
	getActiveVehicleById,
	updateVehicle,
	deleteVehicle,
};
