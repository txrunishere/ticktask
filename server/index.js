import { env } from "./config/env.config.js";

import express from "express";
import cors from "cors";
import { globalErrorHandler } from "./middlewares/error.middleware.js";
import { connectDB } from "./config/db.js";

const app = express();

const allowedOrigins = (env.ORIGIN_URL || "http://localhost:3000").split(", ");
app.use(
  cors({
    origin: allowedOrigins,
  }),
);

app.use(express.json());

app.get("/health-check", (_req, res) => {
  return res.status(200).json({
    status: "OK",
  });
});

import taskRouter from "./routes/task.routes.js";

app.use("/api/tasks", taskRouter);

// Route not found handler
app.use((req, res) => {
  res
    .status(404)
    .json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

app.use(globalErrorHandler);

connectDB().then(() => {
  app.listen(env.PORT, () => {
    console.log(`Server is running on PORT: ${env.PORT}`);
  });
});
