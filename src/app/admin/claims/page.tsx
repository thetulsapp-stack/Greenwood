
"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdminShell from "@/components/admin/AdminShell";
import { useAuth } from "@/lib/useAuth";
import { hasAdminAccess } from "@/lib/admin";
import { deleteClaim, loadClaims, updateBusiness, updateClaim } from "@/lib/adminData";
import type { ClaimRecord } from "@/lib/adminData";
import { DEFAULT_SITE_SETTINGS } from "@/lib/siteSettings";
import { cssThemeVars } from "@/lib/colors";

export default function ClaimsPage() {
  const { user } = useAuth();
  const canAccess = hasAdminAccess(user?.email);
  const [items, setItems] = useState<ClaimRecord[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const refresh = () => loadClaims().then((rows) => setItems(rows.filter((row) => row.status !== "rejected"))).catch(() => undefined);
  useEffect(() => { if (canAccess) refresh(); }, [canAccess]);

  const decide = async (item: ClaimRecord, status: "approved" | "rejected") => {
    if (status === "approved" && item.businessId) {
      await updateBusiness(item.businessId, { ownerUid: item.ownerUid || null, ownerEmail: item.ownerEmail || null, claimedAt: new Date().toISOString() });
    }
    if (status === "rejected") {
      await deleteClaim(item.id);
      setMessage("Claim rejected and removed.");
    } else {
      await updateClaim(item.id, { status });
      setMessage(`Claim ${status}.`);
    }
    refresh();
  };

  return <div style={cssThemeVars(DEFAULT_SITE_SETTINGS.theme)}><Navbar /><main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">{canAccess ? <AdminShell title="Claim requests" description="Approve owner requests without giving them admin access.">{message ? <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-emerald-800">{message}</div> : null}<div className="grid gap-4">{items.map((item) => <div key={item.id} className="rounded-[28px] border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-soft)]"><div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div><p className="text-lg font-semibold text-[var(--text)]">{item.businessName || item.businessId}</p><p className="mt-1 text-sm text-[var(--muted)]">Requested by {item.ownerEmail || "Unknown owner"}</p><p className="mt-1 text-sm text-[var(--muted)]">Status: {item.status || "pending"}</p></div><div className="flex flex-wrap gap-2"><button onClick={() => decide(item, "approved")} className="rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white">Approve claim</button><button onClick={() => decide(item, "rejected")} className="rounded-full border border-red-300 px-4 py-2 text-sm font-semibold text-red-700">Reject</button></div></div></div>)}{!items.length ? <div className="rounded-[28px] border border-dashed border-[var(--border)] bg-white p-6 text-sm text-[var(--muted)]">No claim requests yet.</div> : null}</div></AdminShell> : <div className="rounded-[28px] border border-[var(--border)] bg-white p-8">Admin access required.</div>}</main><Footer /></div>;
}
