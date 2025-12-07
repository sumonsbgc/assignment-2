enum Roles {
	admin = "admin",
	customer = "customer",
}

export type IRoles = keyof typeof Roles;
const isValidRole = new Set<IRoles>([Roles.admin, Roles.customer]);

export { Roles, isValidRole };
