import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import config from "../config";

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

const encrypt = async (payload: JwtPayload): Promise<string> => {
	const token = jwt.sign(
		{
			name: payload.name,
			email: payload.email,
			role: payload.role,
		},
		config.jwtSecret as string,
		{
			expiresIn: "7d",
		}
	);

	return token;
};

const decrypt = (token: string): JwtPayload => {
	return jwt.verify(token, config.jwtSecret) as JwtPayload;
};

const helpers = {
	makeHashPassword,
	isPasswordMatched,
	encrypt,
	decrypt,
};

export { helpers };
