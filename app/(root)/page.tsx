"use client";
export const dynamic = "force-dynamic";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, currentRole } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated || !currentRole) {
      router.replace("/login");
      return;
    }
    router.replace(`/${currentRole}`);
  }, [isAuthenticated, currentRole, router]);

  return null;
}
