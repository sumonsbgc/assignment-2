import express from "express";
const app = express();

import { router } from "./router";
import { applyMiddleware } from "./middleware/middelware";
import { initDB } from "./database/db";

applyMiddleware(app);
app.use("/api/v1/", router);

initDB();

export { app };
