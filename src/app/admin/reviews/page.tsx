
"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdminShell from "@/components/admin/AdminShell";
import { useAuth } from "@/lib/useAuth";
import { hasAdminAccess } from "@/lib/admin";
import { deleteReview, loadReviews } from "@/lib/adminData";
import type { ReviewRecord } from "@/lib/adminData";
import { DEFAULT_SITE_SETTINGS } from "@/lib/siteSettings";
import { cssThemeVars } from "@/lib/colors";

export default function ReviewsPage() {
  const { user } = useAuth();
  const canAccess = hasAdminAccess(user?.email);
  const [items, setItems] = useState<ReviewRecord[]>([]);
  const refresh = () => loadReviews().then(setItems).catch(() => undefined);
  useEffect(() => { if (canAccess) refresh(); }, [canAccess]);
  return <div style={cssThemeVars(DEFAULT_SITE_SETTINGS.theme)}><Navbar /><main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">{canAccess ? <AdminShell title="Reviews moderation" description="Every review card has a real action."><div className="grid gap-4">{items.map((item) => <div key={item.id} className="rounded-[28px] border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-soft)]"><div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"><div><p className="text-sm font-semibold text-[var(--muted)]">{item.authorName || "Guest"} · {item.rating || 0}/5</p><p className="mt-2 text-[var(--text)]">{item.comment || "No comment."}</p><p className="mt-2 text-sm text-[var(--muted)]">Business: {item.businessId || "Unknown"}</p></div><button onClick={async () => { await deleteReview(item.id); refresh(); }} className="rounded-full border border-red-300 px-4 py-2 text-sm font-semibold text-red-700">Delete</button></div></div>)}{!items.length ? <div className="rounded-[28px] border border-dashed border-[var(--border)] bg-white p-6 text-sm text-[var(--muted)]">No reviews found.</div> : null}</div></AdminShell> : <div className="rounded-[28px] border border-[var(--border)] bg-white p-8">Admin access required.</div>}</main><Footer /></div>;
}
