export type College = {
  id: number;
  name: string;
  location: string;
  fees: number;
  rating: number;
  mainCourse: string;
  courses: string[];
  placementPercentage: number;
  description: string;
  imageUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type Review = {
  id: number;
  collegeId: number;
  studentName: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export type CollegeDetail = College & {
  reviews: Review[];
};

export type PaginatedColleges = {
  items: College[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type Filters = {
  locations: string[];
  courses: string[];
  feeRange: { min: number; max: number };
};

export type Prediction = {
  cutoffId: number;
  exam: string;
  course: string;
  minRank: number;
  maxRank: number;
  college: College;
};
