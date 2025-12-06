import { Request, Response } from "express";

class AuthController {
	async signin(req: Request, res: Response) {
		res.send("Login endpoint");
	}

	async signup(req: Request, res: Response) {
		const { name, email, password, phone } = req.body;
		console.log(name, email, password, phone);

		res.send("Signup endpoint");
	}
}

const authController = new AuthController();

export { authController };
