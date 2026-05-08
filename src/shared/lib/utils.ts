import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { routing } from "@/src/i18n/routing";
import { User } from "next-auth";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInternalPathname(pathname: string): string {
  const locales = routing.locales;
  const parts = pathname.split("/");
  if (parts[1] && locales.includes(parts[1] as "en" | "ar")) {
    return "/" + parts.slice(2).join("/");
  }
  return pathname;
}

export const routePermissions: Record<string, string> = {
  "/dashboard": "Dashboard.View",
  "/users": "UsersManagement.View",
  "/members": "MembersManagement.View",
  "/roles-permissions": "RolesManagement.View",
  "/settings": "SystemAdministration.ManageSettings",
};

export const checkUserPermissions = (pathname: string, user: User) => {
  const internalPath = getInternalPathname(pathname);

  const globalRoutes = ["/", "/profile"];
  if (
    globalRoutes.some(
      (route) => internalPath === route || internalPath.startsWith(`${route}/`),
    )
  ) {
    return true;
  }

  // Admin has access to everything
  if (user?.role?.toLowerCase() === "admin") {
    return true;
  }

  const matchedRoute = Object.keys(routePermissions).find(
    (route) => internalPath === route || internalPath.startsWith(`${route}/`),
  );

  if (matchedRoute) {
    const requiredPermission = routePermissions[matchedRoute];
    return user?.permissions?.includes(requiredPermission);
  }

  return true;
};

export function stripLocale(pathname: string): string {
  for (const locale of routing.locales) {
    if (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) {
      return pathname.slice(locale.length + 1) || "/";
    }
  }
  return pathname;
}
