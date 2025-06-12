import express from "express";
import cors from "cors";
import type { Application } from "express";
import router from "../../controllers/api.ts";
import { errorHandler } from "./errorHandler.ts";
import { apiLogger } from "./apiLogger.ts";

export const app: Application = express();

// app.use(express.urlencoded({ extended: true })); // grant access to body of form data
// app.use(express.static(path.join(__dirname, 'public')));

// allow cross-origin requests from frontend
// pre-flight requests are already handled for all routes.
app.use(cors()); 

// middleware to parse JSON bodies and populate req.body
app.use(express.json());

app.use(apiLogger);

app.use(router);

// Global error handler (should be after routes)
app.use(errorHandler);