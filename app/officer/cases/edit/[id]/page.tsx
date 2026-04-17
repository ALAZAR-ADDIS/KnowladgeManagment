import { Suspense } from "react";
import EditCasePage from "./_client";

export function generateStaticParams() { return []; }

export default function Page() {
  return <Suspense><EditCasePage /></Suspense>;
}
