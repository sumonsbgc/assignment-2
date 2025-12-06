import { Request, Response } from "express";
import { userService } from "./user.service";

class UserController {
	async getUsers(req: Request, res: Response) {
		try {
			const result = await userService.getUsers();

			if (result.rows.length === 0) {
				return res.status(404).json({
					success: false,
					message: "No users found",
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
				return res.status(404).json({
					success: false,
					message: "User not found",
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

			// check if user has any active bookings before deleting. If yes, prevent deletion.

			const result = await userService.deleteUser(Number(userId));

			if (result.rowCount === 0) {
				return res.status(404).json({
					success: false,
					message: "User not found",
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
