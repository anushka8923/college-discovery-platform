import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { ZodError } from "zod";
import { apiRouter } from "./routes/index.js";
import { ApiError, errorHandler, notFound } from "./middleware/error.js";

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") ?? "http://localhost:3000",
    credentials: true
  })
);
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (_req, res) => {
  res.json({ success: true, message: "Backend is running" });
});

app.use("/api", apiRouter);

app.use((err: unknown, _req: express.Request, _res: express.Response, next: express.NextFunction) => {
  if (err instanceof ZodError) {
    next(new ApiError(400, err.errors[0]?.message ?? "Invalid request"));
    return;
  }
  next(err);
});

app.use(notFound);
app.use(errorHandler);
