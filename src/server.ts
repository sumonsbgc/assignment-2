import { app } from "./app";
import config from "./config";
import { startAutoReturnJob } from "./lib/job";

startAutoReturnJob();

app.listen(config.port, () => {
	console.log(`Server is running on port ${config.port}`);
});
