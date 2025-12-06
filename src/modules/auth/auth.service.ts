import jwt from "jsonwebtoken";

import { pool } from "../../database/db";
import { helpers } from "../../lib/helper";
import { IUserValidData } from "./auth.type";
import config from "../../config";

const createUser = async (data: IUserValidData) => {
	const { name, email, password, phone, role = "customer" } = data;
	const hashPassword = await helpers.makeHashPassword(password);

	const result = await pool.query(
		"INSERT INTO users (name, email, password, phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, phone, role",
		[name, email, hashPassword, phone, role]
	);

	return result;
};

const loginUser = async (data: Pick<IUserValidData, "email" | "password">) => {
	const { email, password } = data;
	const { isUserExists: isExists, user } = await isUserExists(email, true);

	if (isExists && user) {
		const isPasswordValid = await helpers.isPasswordMatched(
			password,
			user.password
		);

		if (isPasswordValid) {
			const token = jwt.sign(
				{
					name: user.name,
					email: user.email,
					role: user.role,
				},
				config.jwtSecret as string,
				{
					expiresIn: "7d",
				}
			);

			const { password, ...restUser } = user;

			return {
				isUserExists: !!isPasswordValid,
				message: "Login successful",
				user: restUser,
				token: token,
			};
		}

		return {
			isUserExists: !!isPasswordValid,
			user: null,
			message: "Password Is invalid",
			token: null,
		};
	}

	return {
		isUserExists: !!isExists,
		user: null,
		token: null,
		message: "User does not exist",
	};
};

const isUserExists = async (
	email: string,
	includePassword: boolean = false
) => {
	const columns = includePassword ? "*" : "id, name, email, phone, role";

	const result = await pool.query(
		`SELECT ${columns} FROM users WHERE email = $1`,
		[email]
	);

	const userExists = result.rows.length > 0;
	const user = userExists ? result.rows[0] : null;

	return {
		isUserExists: userExists,
		user,
	};
};

export const service = {
	createUser,
	isUserExists,
	loginUser,
};
