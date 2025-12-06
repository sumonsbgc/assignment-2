import { pool } from "../../database/db";
import { Roles } from "../auth/auth.constant";
type IRoles = keyof typeof Roles;

const getUsers = async () => {
	const result = await pool.query(
		"SELECT id, name, email, phone, role FROM users"
	);

	return result;
};

const updateUser = async (
	userId: number,
	userData: { name: string; email: string; phone: string; role: IRoles }
) => {
	const { name, email, phone, role } = userData;

	const result = await pool.query(
		`UPDATE users SET name = $1, email = $2, phone = $3, role = $4 WHERE id = $5 RETURNING id, name, email, phone, role`,
		[name, email, phone, role, userId]
	);

	return result;
};

const deleteUser = async (userId: number) => {
	const result = await pool.query("DELETE FROM users where id = $1", [userId]);
	return result;
};

const getUserById = async (userId: number) => {
	const result = await pool.query(
		"SELECT id, name, email, phone, role FROM users WHERE id = $1",
		[userId]
	);

	return result;
};

const getUserByEmail = async (email: string) => {
	const result = await pool.query(
		"SELECT id, name, email, phone, role FROM users WHERE email = $1",
		[email]
	);

	return result;
};

export const userService = {
	getUsers,
	getUserById,
	getUserByEmail,
	updateUser,
	deleteUser,
};
