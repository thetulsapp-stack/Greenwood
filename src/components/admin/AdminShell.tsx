
"use client";

import Link from "next/link";
import type { ReactNode } from "react";

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/listings", label: "Listings" },
  { href: "/admin/submissions", label: "Submissions" },
  { href: "/admin/claims", label: "Claims" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/settings", label: "Settings" },
  { href: "/admin/editor", label: "Visual editor" },
  { href: "/owner/dashboard", label: "Owner view" },
];

export default function AdminShell({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <div className="grid gap-6 xl:grid-cols-[240px_minmax(0,1fr)]">
      <aside className="space-y-3 rounded-[28px] border border-[var(--border)] bg-[rgba(255,253,252,0.9)] p-4 shadow-[var(--shadow-soft)] h-max">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Greenwood admin</p>
          <p className="mt-2 text-lg font-semibold text-[var(--primary)]">Operations</p>
        </div>
        <nav className="grid gap-2">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm font-medium text-[var(--text)] hover:border-[var(--primary)] hover:text-[var(--primary)]">
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>

      <section className="space-y-6">
        <div className="rounded-[28px] border border-[var(--border)] bg-[rgba(255,253,252,0.92)] p-6 shadow-[var(--shadow-soft)]">
          <h1 className="text-3xl font-semibold text-[var(--primary)]">{title}</h1>
          {description ? <p className="mt-2 text-sm text-[var(--muted)]">{description}</p> : null}
        </div>
        {children}
      </section>
    </div>
  );
}
