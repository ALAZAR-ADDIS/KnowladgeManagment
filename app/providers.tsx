"use client";

import type { ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "@/store/store";

export default function Providers({ children }: { children: ReactNode }) {
  try {
    return <Provider store={store}>{children}</Provider>;
  } catch {
    return <>{children}</>;
  }
}
