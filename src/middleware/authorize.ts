import { NextFunction, Request, Response } from "express";
import { Roles } from "../modules/auth/auth.constant";

type IRoles = keyof typeof Roles;

const authorize = (...roles: IRoles[]) => {
	return (req: Request, res: Response, next: NextFunction) => {
		try {
			const user = req.user;

			if (!user) {
				return res.status(401).json({
					success: false,
					message: "Authentication required",
				});
			}

			if (roles.length && !roles.includes(user.role as IRoles)) {
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
};

export { authorize };
