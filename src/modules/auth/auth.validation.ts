import { Request } from "express";
import { IUserValidData } from "./auth.type";
import { isValidRole } from "./auth.constant";

interface IValidationResponse {
	isValid: boolean;
	message: string;
	data: IUserValidData;
}

interface ILoginValidationResponse {
	isValid: boolean;
	message: string;
	data: Pick<IUserValidData, "email" | "password">;
}

export const validateSignupData = (
	data: Request["body"]
): IValidationResponse => {
	const { name, email, password, phone, role } = data;

	if (!name || typeof name !== "string" || name.trim().length === 0) {
		return {
			isValid: false,
			message: "Name is required",
			data: {} as IUserValidData,
		};
	}

	if (!email || typeof email !== "string") {
		return {
			isValid: false,
			message: "Email is required",
			data: {} as IUserValidData,
		};
	}

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(email)) {
		return {
			isValid: false,
			message: "Invalid email address",
			data: {} as IUserValidData,
		};
	}

	if (!password || typeof password !== "string" || password.length < 6) {
		return {
			isValid: false,
			message: "Password is required and must be at least 6 characters",
			data: {} as IUserValidData,
		};
	}

	if (!phone || typeof phone !== "string" || phone.trim().length === 0) {
		return {
			isValid: false,
			message: "Phone is required",
			data: {} as IUserValidData,
		};
	}

	if (role && !isValidRole.has(role)) {
		return {
			isValid: false,
			message: "The role is not valid",
			data: {} as IUserValidData,
		};
	}

	return {
		isValid: true,
		message: "Successfully Validated",
		data: {
			name: name.trim(),
			email: email.toLocaleLowerCase().trim(),
			password,
			phone: phone.trim(),
			role: role.toLocaleLowerCase().trim(),
		},
	};
};

export const validationLoginData = (
	data: Request["body"]
): ILoginValidationResponse => {
	const { email, password } = data;
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	if (!email || !emailRegex.test(email)) {
		return {
			isValid: false,
			message: "Invalid email address",
			data: {} as IUserValidData,
		};
	}

	if (!password || typeof password !== "string" || password.length < 6) {
		return {
			isValid: false,
			message: "Password is required and must be at least 6 characters",
			data: {} as IUserValidData,
		};
	}

	return {
		isValid: true,
		message: "Successfully Validated",
		data: {
			email: email.toLocaleLowerCase().trim(),
			password,
		} as Pick<IUserValidData, "email" | "password">,
	};
};

export const validation = {
	validateSignupData,
	validationLoginData,
};
