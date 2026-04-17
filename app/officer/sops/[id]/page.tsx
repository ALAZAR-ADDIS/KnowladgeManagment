import { Suspense } from "react";
import SopDetailPage from "./_client";

export function generateStaticParams() { return []; }

export default function Page() {
  return <Suspense><SopDetailPage /></Suspense>;
}
