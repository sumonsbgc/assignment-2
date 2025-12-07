enum BookingStaus {
	active = "active",
	returned = "returned",
	cancelled = "cancelled",
}

export type IBookingStatus = keyof typeof BookingStaus;

const isValidRole = new Set<IBookingStatus>([
	BookingStaus.active,
	BookingStaus.returned,
	BookingStaus.cancelled,
]);

export { BookingStaus, isValidRole };
