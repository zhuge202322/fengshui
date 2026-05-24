"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  async function handle() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }
  return (
    <button
      type="button"
      onClick={handle}
      className="text-xs underline opacity-70 hover:opacity-100"
    >
      Sign out
    </button>
  );
}
