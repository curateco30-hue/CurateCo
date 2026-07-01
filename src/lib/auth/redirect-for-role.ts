import type { ProfileRole } from "@/types/database";

export function dashboardPathForRole(role: ProfileRole): string {
  switch (role) {
    case "admin":
      return "/admin";
    case "brand":
      return "/brand/dashboard";
    case "curator":
      return "/curator/products";
    default:
      return "/";
  }
}
