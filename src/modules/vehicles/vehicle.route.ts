import { Router } from "express";
import { vehicleController } from "./vehicle.controller";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";

const vehicleRouter = Router();

vehicleRouter.get("/", vehicleController.getVehicles);
vehicleRouter.get("/:vehicleId", vehicleController.getVehicleById);

vehicleRouter.post(
	"/",
	authenticate(),
	authorize("admin"),
	vehicleController.createVehicle
);

vehicleRouter.put(
	"/:vehicleId",
	authenticate(),
	authorize("admin"),
	vehicleController.updateVehicle
);

vehicleRouter.delete(
	"/:vehicleId",
	authenticate(),
	authorize("admin"),
	vehicleController.deleteVehicle
);

export { vehicleRouter };
