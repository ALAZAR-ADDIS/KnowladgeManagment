import { Suspense } from "react";
import OfficerCaseDetailPage from "./_client";

export function generateStaticParams() { return []; }

export default function Page() {
  return <Suspense><OfficerCaseDetailPage /></Suspense>;
}
