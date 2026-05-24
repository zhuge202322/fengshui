import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { LogoutButton } from "@/components/LogoutButton";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/posts", label: "Articles" },
  { href: "/admin/media", label: "Media" },
  { href: "/admin/categories", label: "Categories & Tags" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="flex min-h-screen">
      <aside
        className="hidden w-64 shrink-0 flex-col border-r p-6 md:flex"
        style={{ borderColor: "var(--c-border)", background: "var(--c-surface)" }}
      >
        <div className="flex items-center gap-2">
          <span
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border"
            style={{ borderColor: "var(--c-primary)", color: "var(--c-primary-soft)" }}
          >
            靈
          </span>
          <div>
            <div className="text-sm font-medium gold-text" style={{ fontFamily: "Cinzel" }}>
              LingYun CMS
            </div>
            <div className="text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--c-muted)" }}>
              Admin Console
            </div>
          </div>
        </div>

        <nav className="mt-10 flex flex-col gap-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm transition hover:bg-white/5"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto pt-8 text-xs" style={{ color: "var(--c-muted)" }}>
          <div className="truncate">{session.email}</div>
          <div className="badge mt-2">{session.role}</div>
          <div className="mt-3">
            <LogoutButton />
          </div>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-10">{children}</main>
    </div>
  );
}
