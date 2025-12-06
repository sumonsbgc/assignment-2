import { Request, Response } from "express";
import { authService } from "./auth.service";
import { validation } from "./auth.validation";

class AuthController {
	async signin(req: Request, res: Response) {
		try {
			const { isValid, message, data } = validation.validationLoginData(
				req.body
			);

			if (!isValid) {
				return res.status(400).json({
					success: false,
					message: message,
				});
			}

			const {
				user,
				token,
				isUserExists,
				message: loginMessage,
			} = await authService.loginUser(data);

			if (!isUserExists && !token) {
				return res.status(400).json({
					success: false,
					message: loginMessage,
				});
			} else {
				return res.status(200).json({
					success: true,
					message: loginMessage,
					data: {
						token: token,
						user: user,
					},
				});
			}
		} catch (error: any) {
			return res.status(500).json({
				success: false,
				message: "Login failed",
				error: error.message,
			});
		}
	}

	async signup(req: Request, res: Response) {
		try {
			const { isValid, message, data } = validation.validateSignupData(
				req.body
			);

			if (!isValid) {
				return res.status(400).json({
					success: false,
					message: message,
				});
			}

			const { isUserExists, user } = await authService.isUserExists(data.email);

			console.log("is user exists in controller", { isUserExists, user });

			if (isUserExists) {
				return res.status(400).json({
					success: false,
					message: "User already exists",
				});
			}

			const result = await authService.createUser(data);

			if (result?.rows?.length > 0) {
				return res.status(201).json({
					success: true,
					message: "User registered successfully",
					user: result.rows[0],
				});
			} else {
				return res.status(400).json({
					success: false,
					message: "User creation failed",
				});
			}
		} catch (error: any) {
			return res.status(500).json({
				success: false,
				message: "User creation failed",
				error: error.message,
			});
		}
	}
}

const authController = new AuthController();

export { authController };
