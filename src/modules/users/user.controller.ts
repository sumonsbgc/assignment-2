import { Request, Response } from "express";
import { userService } from "./user.service";
import { Roles } from "../auth/auth.constant";
import { bookingService } from "../bookings/booking.service";

class UserController {
	async getUsers(req: Request, res: Response) {
		try {
			const result = await userService.getUsers();

			if (result.rows.length === 0) {
				return res.status(200).json({
					success: true,
					message: "No users found",
					data: [],
				});
			}

			return res.status(200).json({
				success: true,
				message: "Users retrieved successfully",
				data: result.rows,
			});
		} catch (error: any) {
			return res.status(500).json({
				success: false,
				message: "Failed to get users",
				error: error.message,
			});
		}
	}

	async updateUser(req: Request, res: Response) {
		try {
			const userId = req.params.userId;
			const { name, email, phone, role = "customer" } = req.body;

			const result = await userService.updateUser(Number(userId), {
				name,
				email,
				phone,
				role,
			});

			if (result.rowCount === 0) {
				return res.status(200).json({
					success: true,
					message: "User not found",
					data: [],
				});
			}

			return res.status(200).json({
				success: true,
				message: "User updated successfully",
				data: result.rows[0],
			});
		} catch (error: any) {
			return res.status(500).json({
				success: false,
				message: "Failed to update user",
				error: error.message,
			});
		}
	}

	async deleteUser(req: Request, res: Response) {
		try {
			const userId = req.params.userId;

			const activeBookingResult =
				await bookingService.getActiveBookingsByCustomerId(Number(userId));

			if (activeBookingResult.rows.length > 0) {
				return res.status(400).json({
					success: false,
					message:
						"User has active bookings and cannot be deleted. Please resolve active bookings first.",
				});
			}

			const result = await userService.deleteUser(Number(userId));

			if (result.rowCount === 0) {
				return res.status(200).json({
					success: true,
					message: "User not found",
					data: [],
				});
			}

			return res.status(200).json({
				success: true,
				message: "User deleted successfully",
			});
		} catch (error: any) {
			return res.status(500).json({
				success: false,
				message: "Failed to delete user",
				error: error.message,
			});
		}
	}
}

const userController = new UserController();
export { userController };
