"use client";

import type { ReactNode } from "react";
import { useAppSelector } from "@/store/hooks";
import { resolveLocale, translateLoose } from "@/lib/i18n";

type ModalProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
};

export default function Modal({ open, title, onClose, children }: ModalProps) {
  const languageLabel = useAppSelector((state) => state.admin.settings.language);
  const locale = resolveLocale(languageLabel);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <button className="text-sm text-slate-500 hover:text-slate-900" onClick={onClose}>
            {translateLoose(locale, "Close")}
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
