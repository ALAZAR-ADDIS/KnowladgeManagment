"use client";

import { ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { clearAuthError, loginWithCredentials } from "@/store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export default function LoginPage() {
  const { availableUsers, isAuthenticated, currentRole, loginError } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showAccountPicker, setShowAccountPicker] = useState(false);

  const demoCredentials = useMemo(
    () =>
      availableUsers.map((user) => ({
        role: user.role,
        email: user.email,
        password: user.password,
      })),
    [availableUsers],
  );

  const applyDemoAccount = (emailValue: string, passwordValue: string) => {
    setEmail(emailValue);
    setPassword(passwordValue);
    setShowAccountPicker(false);
    if (loginError) dispatch(clearAuthError());
  };

  useEffect(() => {
    if (isAuthenticated && currentRole) {
      router.replace(`/${currentRole}`);
    }
  }, [currentRole, isAuthenticated, router]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f3f8ff] px-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.14),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(14,165,233,0.12),transparent_40%),linear-gradient(to_bottom_right,#e8f2ff,#f7fbff)]" />
      <div className="relative w-full max-w-xl rounded-2xl border border-blue-200 bg-white/90 p-8 shadow-2xl shadow-blue-100/60 backdrop-blur">
        <div className="mb-6 text-center">
          <ShieldCheck className="mx-auto mb-3 h-10 w-10 text-blue-600" />
          <h1 className="text-2xl font-semibold text-slate-900">EFPC Knowledge Management System</h1>
          <p className="mt-1 text-sm text-slate-600">School MVP login with dummy role credentials</p>
        </div>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            dispatch(loginWithCredentials({ email, password }));
          }}
        >
          <div className="relative">
            <label htmlFor="email" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onFocus={() => setShowAccountPicker(true)}
              onBlur={() => {
                window.setTimeout(() => setShowAccountPicker(false), 120);
              }}
              onChange={(e) => {
                setEmail(e.target.value);
                if (loginError) dispatch(clearAuthError());
              }}
              placeholder="Enter email"
              className="w-full rounded-lg border border-blue-200 bg-blue-50/40 px-3 py-2 text-sm text-slate-900 outline-none ring-blue-400 placeholder:text-slate-500 focus:ring-2"
            />

            {showAccountPicker ? (
              <div className="absolute z-20 mt-2 w-full rounded-lg border border-blue-200 bg-white p-2 shadow-lg shadow-blue-100/70">
                <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Click an account to auto-fill</p>
                <div className="space-y-1">
                  {availableUsers.map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        applyDemoAccount(user.email, user.password);
                      }}
                      className="w-full rounded-md border border-blue-100 bg-blue-50/60 px-3 py-2 text-left text-xs transition hover:bg-blue-100"
                    >
                      <p className="font-semibold uppercase tracking-wide text-blue-700">{user.role}</p>
                      <p className="text-slate-700">{user.email}</p>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onFocus={() => setShowAccountPicker(true)}
              onBlur={() => {
                window.setTimeout(() => setShowAccountPicker(false), 120);
              }}
              onChange={(e) => {
                setPassword(e.target.value);
                if (loginError) dispatch(clearAuthError());
              }}
              placeholder="Enter password"
              className="w-full rounded-lg border border-blue-200 bg-blue-50/40 px-3 py-2 text-sm text-slate-900 outline-none ring-blue-400 placeholder:text-slate-500 focus:ring-2"
            />
          </div>

          {loginError ? (
            <p className="rounded-md border border-rose-700/50 bg-rose-900/20 px-3 py-2 text-xs text-rose-300">{loginError}</p>
          ) : null}

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            Login
          </button>
        </form>

        <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50/60 p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-700">Dummy credentials for testing</p>
          <div className="space-y-2 text-xs text-slate-700">
            {demoCredentials.map((item) => (
              <button
                key={item.role}
                type="button"
                onClick={() => applyDemoAccount(item.email, item.password)}
                className="w-full rounded-md border border-blue-200 bg-white px-3 py-2 text-left transition hover:bg-blue-50"
              >
                <p className="font-semibold uppercase tracking-wide text-blue-300">{item.role}</p>
                <p>Email: {item.email}</p>
                <p>Password: {item.password}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
