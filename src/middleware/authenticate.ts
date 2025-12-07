import { NextFunction, Request, Response } from "express";
import { helpers } from "../lib/helper";
import { JwtPayload } from "jsonwebtoken";
import { userService } from "../modules/users/user.service";

const authenticate = () => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			const authorization = req.headers.authorization;
			const [_, token] = authorization?.split(" ") || [];

			if (!token) {
				return res.status(401).json({
					success: false,
					message: "You are not authorized to access this resource",
				});
			}

			const decoded = helpers.decrypt(token) as JwtPayload;
			const result = await userService.getUserByEmail(decoded.email);

			if (!result || result.rows.length === 0) {
				return res.status(401).json({
					success: false,
					message: "User not found",
				});
			}

			const user = result.rows[0];
			req.user = {
				id: user.id,
				name: user.name,
				email: user.email,
				role: user.role,
			};

			next();
		} catch (error: Error | any) {
			return res.status(500).json({
				success: false,
				message: "Internal server error",
				errors: (error as Error).message,
			});
		}
	};
};

export { authenticate };
