import { Router } from "express";
import { getCollege, getColleges } from "../controllers/collegeController.js";
import { asyncHandler } from "../middleware/error.js";

export const collegeRouter = Router();

collegeRouter.get("/", asyncHandler(getColleges));
collegeRouter.get("/:id", asyncHandler(getCollege));
