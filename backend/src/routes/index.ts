import { Router } from "express";
import { getCompare, getFilterOptions, postPredict } from "../controllers/collegeController.js";
import { asyncHandler } from "../middleware/error.js";
import { collegeRouter } from "./collegeRoutes.js";

export const apiRouter = Router();

apiRouter.get("/health", (_req, res) => {
  res.json({ success: true, data: { status: "ok" } });
});
apiRouter.use("/colleges", collegeRouter);
apiRouter.get("/compare", asyncHandler(getCompare));
apiRouter.post("/predict", asyncHandler(postPredict));
apiRouter.get("/filters", asyncHandler(getFilterOptions));
