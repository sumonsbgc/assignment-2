import express from "express";
const app = express();

import { router } from "./router";
import { applyMiddleware } from "./middleware/middelware";

applyMiddleware(app);
app.use("/api/v1/", router);

export { app };
