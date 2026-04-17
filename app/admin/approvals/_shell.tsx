"use client";

import { useState, useEffect } from "react";

export default function ApprovalsShell() {
  const [Comp, setComp] = useState<React.ComponentType | null>(null);
  useEffect(() => {
    import("./_client").then((m) => setComp(() => m.default));
  }, []);
  if (!Comp) return null;
  return <Comp />;
}
