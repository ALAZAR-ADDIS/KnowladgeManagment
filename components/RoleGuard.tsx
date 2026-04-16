"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Role } from "@/store/slices/types";
import { useAppSelector } from "@/store/hooks";

type RoleGuardProps = {
  allowedRoles: Role[];
  children: React.ReactNode;
};

const dashboardByRole: Record<Role, string> = {
  admin: "/admin",
  officer: "/officer",
  viewer: "/viewer",
};

export default function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const { isAuthenticated, currentRole } = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || !currentRole) {
      router.replace("/login");
      return;
    }
    if (!allowedRoles.includes(currentRole)) {
      router.replace(dashboardByRole[currentRole]);
    }
  }, [allowedRoles, currentRole, isAuthenticated, router]);

  if (!isAuthenticated || !currentRole || !allowedRoles.includes(currentRole)) {
    return null;
  }

  return <>{children}</>;
}
