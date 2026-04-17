"use client";

import dynamic from "next/dynamic";

const OfficerDashboard = dynamic(() => import("./_dashboard"), { ssr: false, loading: () => null });

export default function OfficerShell() {
  return <OfficerDashboard />;
}
