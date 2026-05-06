import type { College, CollegeDetail, Filters, PaginatedColleges, Prediction } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

type ApiResponse<T> = {
  success: boolean;
  data: T;
  error?: string;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}/api${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers
    },
    
  });
  const payload = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !payload.success) {
    throw new Error(payload.error ?? "Request failed");
  }

  return payload.data;
}

export function getColleges(params: URLSearchParams) {
  return request<PaginatedColleges>(`/colleges?${params.toString()}`);
}

export function getCollege(id: string) {
  return request<CollegeDetail>(`/colleges/${id}`);
}

export function getFilters() {
  return request<Filters>("/filters");
}

export function compareColleges(ids: number[]) {
  return request<College[]>(`/compare?ids=${ids.join(",")}`);
}

export function predictColleges(exam: string, rank: number) {
  return request<Prediction[]>("/predict", {
    method: "POST",
    body: JSON.stringify({ exam, rank })
  });
}
