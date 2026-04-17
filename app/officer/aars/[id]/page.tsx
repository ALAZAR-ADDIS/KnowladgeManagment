import { Suspense } from "react";
import AarDetailPage from "./_client";

export function generateStaticParams() { return []; }

export default function Page() {
  return <Suspense><AarDetailPage /></Suspense>;
}
