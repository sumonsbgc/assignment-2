import dayjs from "dayjs";

const calculateTotalPrice = (
	startDate: Date,
	endDate: Date,
	dailyRentPrice: number
): number => {
	const diffDays = dayjs(endDate).diff(dayjs(startDate), "day") + 1;
	return diffDays * dailyRentPrice;
};

export { calculateTotalPrice };
