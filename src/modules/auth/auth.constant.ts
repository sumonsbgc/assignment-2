enum Roles {
	admin = "admin",
	customer = "customer",
}

const isValidRole = new Set<string>([Roles.admin, Roles.customer]);

export { Roles, isValidRole };
