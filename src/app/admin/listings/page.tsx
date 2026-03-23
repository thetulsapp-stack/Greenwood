
"use client";

import { useEffect, useMemo, useState } from "react";
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

export default function ListingsAdminPage() {
  const { user } = useAuth();
  const canAccess = hasAdminAccess(user?.email);
  const [items, setItems] = useState<BusinessRecord[]>([]);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const refresh = () => loadBusinesses().then(setItems).catch(() => undefined);
  useEffect(() => { if (canAccess) refresh(); }, [canAccess]);

  const filtered = useMemo(() => items.filter((item) => [item.name, item.category, item.city, item.status].some((v) => String(v || "").toLowerCase().includes(query.toLowerCase()))), [items, query]);

  const updateStatus = async (id: string, status: string) => {
    await updateBusiness(id, { status, verified: status === "approved" });
    setMessage(`Listing updated to ${status}.`);
    refresh();
  };

  return (
    <div style={cssThemeVars(DEFAULT_SITE_SETTINGS.theme)}>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {canAccess ? (
          <AdminShell title="Listings" description="Approve, reject, feature, and send admins or owners to the correct destination.">
            {message ? <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-emerald-800">{message}</div> : null}
            <div className="rounded-[28px] border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-soft)]">
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search businesses" className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3" />
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border)] text-left text-[var(--muted)]">
                      <th className="py-3 pr-4">Business</th><th className="py-3 pr-4">Category</th><th className="py-3 pr-4">Status</th><th className="py-3 pr-4">Owner</th><th className="py-3 pr-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((item) => (
                      <tr key={item.id} className="border-b border-[var(--border)] align-top">
                        <td className="py-4 pr-4"><div className="font-semibold text-[var(--text)]">{item.name}</div><div className="text-[var(--muted)]">{[item.city, item.state].filter(Boolean).join(", ")}</div></td>
                        <td className="py-4 pr-4">{item.category || "—"}</td>
                        <td className="py-4 pr-4">{item.status || "approved"}</td>
                        <td className="py-4 pr-4">{item.ownerEmail || "Unclaimed"}</td>
                        <td className="py-4 pr-4">
                          <div className="flex flex-wrap gap-2">
                            <button onClick={() => updateStatus(item.id, "approved")} className="rounded-full bg-[var(--primary)] px-3 py-2 text-xs font-semibold text-white">Approve</button>
                            <button onClick={() => updateStatus(item.id, "pending")} className="rounded-full border border-[var(--border)] px-3 py-2 text-xs font-semibold">Pending</button>
                            <button onClick={() => updateStatus(item.id, "rejected")} className="rounded-full border border-red-300 px-3 py-2 text-xs font-semibold text-red-700">Reject</button>
                            <Link href={`/business/${item.id}`} className="rounded-full border border-[var(--border)] px-3 py-2 text-xs font-semibold">Open</Link>
                            {item.ownerUid ? <Link href={`/owner/business/${item.id}`} className="rounded-full border border-[var(--border)] px-3 py-2 text-xs font-semibold">Owner edit</Link> : null}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </AdminShell>
        ) : <div className="rounded-[28px] border border-[var(--border)] bg-white p-8">Admin access required. <Link href="/admin">Back</Link></div>}
      </main>
      <Footer />
    </div>
  );
}
