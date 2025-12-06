import { NextFunction, Request, Response } from "express";
import { Roles } from "../modules/auth/auth.constant";

const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = req.user;
		if (!user) {
			return res.status(401).json({
				success: false,
				message: "Authentication required",
			});
		}

		if (user.role === Roles.admin) {
			return next();
		}

		const requestedUserId = String(req.params.userId);

		if (requestedUserId && requestedUserId !== String(user.id)) {
			return res.status(403).json({
				success: false,
				message: "You are not authorized to access this resource",
			});
		}

		next();
	} catch (error: Error | any) {
		return res.status(500).json({
			success: false,
			message: "Internal server error",
			errors: (error as Error).message,
		});
	}
};

export { verifyUser };
