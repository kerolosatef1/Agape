import axios from "axios";
import { getSession } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/src/shared/next-auth/next-auth";
import { redirect } from "next/navigation";

export const api = axios.create({
  baseURL:
    typeof window === "undefined"
      ? process.env.BACKEND_BASE_URL
      : process.env.NEXT_PUBLIC_API_BASE_URL,
});

api.interceptors.request.use(async (config) => {
  if (
    config.url?.includes("/Auth/token") ||
    config.url?.includes("/Auth/register")
  ) {
    return config;
  }

  let token: string | undefined;

  if (typeof window === "undefined") {
    const session = await getServerSession(authOptions);
    token = session?.token;
  } else {
    const session = await getSession();
    token = session?.token;
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (typeof window !== "undefined") {
      if (error.response?.status === 401) {
        window.location.href = "/login";
      }
    } else {
      if (error.response?.status === 401) {
        redirect("/login");
      }
    }
    return Promise.reject(error);
  },
);

// Helper: extract error message from any error
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    // Backend returns string directly
    if (typeof data === "string") return data;
    // Backend returns { message: "..." }
    if (data?.message) return data.message;
    // Backend returns { errors: { field: ["msg"] } }
    if (data?.errors) {
      const firstError = Object.values(data.errors).flat()[0];
      if (typeof firstError === "string") return firstError;
    }
    return error.message;
  }
  if (error instanceof Error) return error.message;
  return "Something went wrong";
}