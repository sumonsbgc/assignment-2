import express, { Application } from "express";

const applyMiddleware = (app: Application) => {
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
};

export { applyMiddleware };
