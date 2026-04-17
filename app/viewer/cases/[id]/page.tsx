import { Suspense } from "react";
import ViewerCaseDetailPage from "./_client";

export function generateStaticParams() { return []; }

export default function Page() {
  return <Suspense><ViewerCaseDetailPage /></Suspense>;
}
