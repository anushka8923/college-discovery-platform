import { prisma } from "../prisma/client.js";
import { ApiError } from "../middleware/error.js";

export type CollegeListQuery = {
  search?: string;
  location?: string;
  course?: string;
  minFees?: number;
  maxFees?: number;
  page: number;
  limit: number;
};

const comparisonSelect = {
  id: true,
  name: true,
  location: true,
  fees: true,
  rating: true,
  mainCourse: true,
  placementPercentage: true
};

export async function listColleges(query: CollegeListQuery) {
  const where = {
    AND: [
      query.search
        ? {
            name: {
              contains: query.search,
              mode: "insensitive" as const
            }
          }
        : {},
      query.location ? { location: query.location } : {},
      query.course ? { courses: { has: query.course } } : {},
      typeof query.minFees === "number" ? { fees: { gte: query.minFees } } : {},
      typeof query.maxFees === "number" ? { fees: { lte: query.maxFees } } : {}
    ]
  };

  const skip = (query.page - 1) * query.limit;
  const [items, total] = await Promise.all([
    prisma.college.findMany({
      where,
      orderBy: [{ rating: "desc" }, { name: "asc" }],
      skip,
      take: query.limit
    }),
    prisma.college.count({ where })
  ]);

  return {
    items,
    meta: {
      total,
      page: query.page,
      limit: query.limit,
      totalPages: Math.ceil(total / query.limit)
    }
  };
}

export async function getCollegeById(id: number) {
  const college = await prisma.college.findUnique({
    where: { id },
    include: { reviews: { orderBy: { createdAt: "desc" } } }
  });

  if (!college) {
    throw new ApiError(404, "College not found");
  }

  return college;
}

export async function compareColleges(ids: number[]) {
  if (ids.length < 2) {
    throw new ApiError(400, "Select at least 2 colleges to compare");
  }
  if (ids.length > 3) {
    throw new ApiError(400, "You can compare up to 3 colleges");
  }

  const colleges = await prisma.college.findMany({
    where: { id: { in: ids } },
    select: comparisonSelect
  });

  if (colleges.length !== ids.length) {
    throw new ApiError(404, "One or more colleges were not found");
  }

  return ids.map((id) => colleges.find((college) => college.id === id));
}

export async function predictColleges(exam: string, rank: number) {
  const matches = await prisma.cutoff.findMany({
    where: {
      exam: { equals: exam, mode: "insensitive" },
      minRank: { lte: rank },
      maxRank: { gte: rank }
    },
    include: { college: true },
    orderBy: [{ maxRank: "asc" }]
  });

  return matches.map((match) => ({
    cutoffId: match.id,
    exam: match.exam,
    course: match.course,
    minRank: match.minRank,
    maxRank: match.maxRank,
    college: match.college
  }));
}

export async function getFilters() {
  const colleges = await prisma.college.findMany({
    select: { location: true, courses: true, fees: true }
  });

  const locations = [...new Set(colleges.map((college) => college.location))].sort();
  const courses = [...new Set(colleges.flatMap((college) => college.courses))].sort();
  const fees = colleges.map((college) => college.fees);

  return {
    locations,
    courses,
    feeRange: {
      min: fees.length ? Math.min(...fees) : 0,
      max: fees.length ? Math.max(...fees) : 0
    }
  };
}
