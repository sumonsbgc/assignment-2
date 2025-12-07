export type IUser = {
	name: string;
	email: string;
	password: string;
	phone: string;
	role: string;
};

export type IVehicle = {
	vehicle_name: string;
	type: string;
	registration_number: string;
	daily_rent_price: number;
	availability_status: string;
};

export type IBooking = {
	customer_id: number;
	vehicle_id: number;
	rent_start_date: Date;
	rent_end_date: Date;
	total_price: number;
	status: string;
};
