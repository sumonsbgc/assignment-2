import bcrypt from "bcryptjs";

const successResponse = (data: any, message = "Success") => {
	return {
		success: true,
		message,
		data,
	};
};

const makeHashPassword = async (password: string): Promise<string> => {
	const hash = await bcrypt.hash(password, 10);
	return hash;
};

const isPasswordMatched = async (
	password: string,
	hashedPassword: string
): Promise<boolean> => {
	const isMatch = await bcrypt.compare(password, hashedPassword);
	return isMatch;
};

const helpers = {
	successResponse,
	makeHashPassword,
	isPasswordMatched,
};

export { helpers };
