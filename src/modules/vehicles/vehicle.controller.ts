import { Request, Response } from "express";
import { vehicleService } from "./vehicle.service";
import { bookingService } from "../bookings/booking.service";

const validTypes = ["car", "bike", "van", "SUV"];

class VehicleController {
	async getVehicles(req: Request, res: Response) {
		try {
			const result = await vehicleService.getVehicles();

			if (result.rows.length === 0) {
				return res.status(200).json({
					success: true,
					message: "No vehicles found",
					data: [],
				});
			}

			return res.status(200).json({
				success: true,
				message: "Vehicles retrieved successfully",
				data: result.rows,
			});
		} catch (error: Error | any) {
			res.status(500).json({ message: error.message });
		}
	}

	async createVehicle(req: Request, res: Response) {
		try {
			const {
				vehicle_name,
				type,
				registration_number,
				daily_rent_price,
				availability_status,
			} = req.body;

			if (!validTypes.includes(type)) {
				return res.status(400).json({
					success: false,
					message: `Invalid vehicle type. Valid types are: ${validTypes.join(
						", "
					)}`,
				});
			}

			const result = await vehicleService.createVehicle({
				vehicle_name,
				type,
				registration_number,
				daily_rent_price,
				availability_status,
			});

			if (result.rows.length === 0) {
				return res.status(400).json({
					success: false,
					message: "Failed to create vehicle",
				});
			}

			return res.status(201).json({
				success: true,
				message: "Vehicle created successfully",
				data: result.rows[0],
			});
		} catch (error: Error | any) {
			res.status(500).json({ message: error.message });
		}
	}

	async getVehicleById(req: Request, res: Response) {
		try {
			const { vehicleId } = req.params;

			if (!vehicleId) {
				return res.status(400).json({
					success: false,
					message: "Vehicle ID is required",
				});
			}

			const result = await vehicleService.getVehicleById(vehicleId);
			if (result.rows.length === 0) {
				return res.status(404).json({
					success: false,
					message: "Vehicle not found",
				});
			}

			return res.status(200).json({
				success: true,
				message: "Vehicle retrieved successfully",
				data: result.rows[0],
			});
		} catch (error: Error | any) {
			res.status(500).json({
				success: false,
				message: "Internal server error",
				error: error.message,
			});
		}
	}

	async updateVehicle(req: Request, res: Response) {
		try {
			const { vehicleId } = req.params;
			const {
				vehicle_name,
				type,
				registration_number,
				daily_rent_price,
				availability_status,
			} = req.body;

			if (!vehicleId) {
				return res.status(400).json({
					success: false,
					message: "Vehicle ID is required",
				});
			}

			const result = await vehicleService.updateVehicle(vehicleId, {
				vehicle_name,
				type,
				registration_number,
				daily_rent_price,
				availability_status,
			});

			if (result.rows.length === 0) {
				return res.status(404).json({
					success: false,
					message: "Vehicle not found",
				});
			}

			return res.status(200).json({
				success: true,
				message: "Vehicle updated successfully",
				data: result.rows[0],
			});
		} catch (error: Error | any) {
			res.status(500).json({
				success: false,
				message: "Internal server error",
				error: error.message,
			});
		}
	}

	async deleteVehicle(req: Request, res: Response) {
		try {
			const { vehicleId } = req.params;

			const activeBookingResult =
				await bookingService.getActiveBookingsByVehicleId(Number(vehicleId));

			if (activeBookingResult.rows.length > 0) {
				return res.status(400).json({
					success: false,
					message:
						"Vehicle has active bookings and cannot be deleted. Please resolve active bookings first.",
				});
			}

			const result = await vehicleService.deleteVehicle(String(vehicleId));

			if (result.rows.length === 0) {
				return res.status(404).json({
					success: false,
					message: "Vehicle not found",
				});
			}

			return res.status(200).json({
				success: true,
				message: "Vehicle deleted successfully",
				data: result.rows[0],
			});
		} catch (error: Error | any) {
			res.status(500).json({
				success: false,
				message: "Internal server error",
				error: error.message,
			});
		}
	}
}

const vehicleController = new VehicleController();
export { vehicleController };
