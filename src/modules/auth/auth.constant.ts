enum Roles {
	admin = "admin",
	customer = "customer",
}

type IRoles = keyof typeof Roles;
const isValidRole = new Set<IRoles>([Roles.admin, Roles.customer]);

export { Roles, isValidRole };
