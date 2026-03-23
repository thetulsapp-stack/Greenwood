
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdminShell from "@/components/admin/AdminShell";
import { useAuth } from "@/lib/useAuth";
import { hasAdminAccess } from "@/lib/admin";
import { loadBusinesses, updateBusiness } from "@/lib/adminData";
import type { BusinessRecord } from "@/lib/business";
import { DEFAULT_SITE_SETTINGS } from "@/lib/siteSettings";
import { cssThemeVars } from "@/lib/colors";

export default function SubmissionsPage() {
  const { user } = useAuth();
  const canAccess = hasAdminAccess(user?.email);
  const [items, setItems] = useState<BusinessRecord[]>([]);
  const refresh = () => loadBusinesses().then((all) => setItems(all.filter((item) => item.status === "pending"))).catch(() => undefined);
  useEffect(() => { if (canAccess) refresh(); }, [canAccess]);
  const act = async (id: string, status: string) => { await updateBusiness(id, { status, verified: status === "approved" }); refresh(); };

  return <div style={cssThemeVars(DEFAULT_SITE_SETTINGS.theme)}><Navbar /><main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">{canAccess ? <AdminShell title="Pending submissions" description="Every approval button now has a destination and status update."><div className="grid gap-4">{items.map((item) => <div key={item.id} className="rounded-[28px] border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-soft)]"><div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"><div><p className="text-xl font-semibold text-[var(--text)]">{item.name}</p><p className="mt-1 text-sm text-[var(--muted)]">{item.category || "Uncategorized"} · {[item.city, item.state].filter(Boolean).join(", ")}</p><p className="mt-3 text-sm text-[var(--muted)]">{item.description || "No description provided."}</p></div><div className="flex flex-wrap gap-2"><button onClick={() => act(item.id, "approved")} className="rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white">Approve</button><button onClick={() => act(item.id, "rejected")} className="rounded-full border border-red-300 px-4 py-2 text-sm font-semibold text-red-700">Reject</button><Link href={`/business/${item.id}`} className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-semibold">Open profile</Link></div></div></div>)}{!items.length ? <div className="rounded-[28px] border border-dashed border-[var(--border)] bg-white p-6 text-sm text-[var(--muted)]">No pending submissions right now.</div> : null}</div></AdminShell> : <div className="rounded-[28px] border border-[var(--border)] bg-white p-8">Admin access required.</div>}</main><Footer /></div>;
}
