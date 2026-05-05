import type { Request, Response } from "express";
import { z } from "zod";
import { ApiError } from "../middleware/error.js";
import { compareColleges, getCollegeById, getFilters, listColleges, predictColleges } from "../services/collegeService.js";

const listQuerySchema = z.object({
  search: z.string().trim().optional(),
  location: z.string().trim().optional(),
  course: z.string().trim().optional(),
  minFees: z.coerce.number().int().nonnegative().optional(),
  maxFees: z.coerce.number().int().nonnegative().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(9)
});

const idSchema = z.coerce.number().int().positive();

const predictSchema = z.object({
  exam: z.string().trim().min(1, "Exam is required"),
  rank: z.coerce.number().int().positive("Rank must be a positive number")
});

export async function getColleges(req: Request, res: Response) {
  const parsed = listQuerySchema.parse(req.query);
  if (parsed.minFees && parsed.maxFees && parsed.minFees > parsed.maxFees) {
    throw new ApiError(400, "Minimum fees cannot be greater than maximum fees");
  }

  const data = await listColleges(parsed);
  res.json({ success: true, data });
}

export async function getCollege(req: Request, res: Response) {
  const id = idSchema.parse(req.params.id);
  const data = await getCollegeById(id);
  res.json({ success: true, data });
}

export async function getCompare(req: Request, res: Response) {
  const idsParam = typeof req.query.ids === "string" ? req.query.ids : "";
  const ids = idsParam
    .split(",")
    .map((id) => Number(id.trim()))
    .filter((id) => Number.isInteger(id) && id > 0);

  const data = await compareColleges(ids);
  res.json({ success: true, data });
}

export async function postPredict(req: Request, res: Response) {
  const parsed = predictSchema.parse(req.body);
  const data = await predictColleges(parsed.exam, parsed.rank);
  res.json({ success: true, data });
}

export async function getFilterOptions(_req: Request, res: Response) {
  const data = await getFilters();
  res.json({ success: true, data });
}
