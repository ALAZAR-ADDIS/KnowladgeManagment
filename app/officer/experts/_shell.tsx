"use client";

import dynamic from "next/dynamic";

const ExpertsInner = dynamic(() => import("./_view"), { ssr: false, loading: () => null });

export default function ExpertsShell() {
  return <ExpertsInner />;
}
