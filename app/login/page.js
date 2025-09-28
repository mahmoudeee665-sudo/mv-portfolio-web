"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password }),
    });
    const j = await res.json().catch(() => ({}));
    if (!res.ok || j?.ok === false) return setErr(j?.error || "Login failed");
    router.push("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 px-4 text-zinc-100">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900/70 p-8 shadow-2xl backdrop-blur">
        <h1 className="text-2xl font-bold text-white">Log in</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Access your MV7mood dashboard
        </p>

        <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
          <input
            className="h-11 rounded-lg border border-zinc-700 bg-zinc-800 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
            placeholder="Email or Username"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
          <input
            type="password"
            className="h-11 rounded-lg border border-zinc-700 bg-zinc-800 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {err && <p className="text-sm text-red-500">{err}</p>}
          <button
            type="submit"
            className="rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-400 py-2.5 font-medium text-zinc-950 shadow hover:brightness-110"
          >
            Sign in
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-zinc-400">
          No account?{" "}
          <a href="/register" className="font-medium text-indigo-400 hover:underline">
            Register
          </a>
        </p>
      </div>
    </main>
  );
}
