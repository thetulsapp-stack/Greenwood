
"use client";

import Link from "next/link";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { requireDb } from "@/lib/firebase";
import { useAuth } from "@/lib/useAuth";
import type { BusinessRecord } from "@/lib/business";
import { normalizeBusiness } from "@/lib/business";

export default function OwnerDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState<BusinessRecord[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      if (!user) return;
      const db = requireDb();
      try {
        const snap = await getDocs(query(collection(db, "businesses"), where("ownerUid", "==", user.uid)));
        setItems(snap.docs.map((docSnap) => normalizeBusiness({ id: docSnap.id, ...(docSnap.data() as any) })));
      } catch (e: any) {
        setError(e?.message ?? "Failed to load dashboard");
      }
    };
    run();
  }, [user]);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="rounded-[32px] border border-[var(--border)] bg-[rgba(255,253,252,.92)] p-8 shadow-[var(--shadow)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-[var(--primary)]">Owner dashboard</h1>
              <p className="mt-2 text-[var(--muted)]">Manage your business listing, respond to the right requests, and jump to the correct page faster.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/submit" className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--primary)]">Submit new business</Link>
              <Link href="/directory" className="rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white">View directory</Link>
            </div>
          </div>
          {authLoading ? <p className="mt-6 text-[var(--muted)]">Loading…</p> : null}
          {!authLoading && !user ? <a href="/owner/login" className="mt-6 inline-flex rounded-2xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white">Log in</a> : null}
          {error ? <div className="mt-6 rounded-2xl border border-red-300 bg-red-50 p-4 text-red-700">{error}</div> : null}

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-[var(--border)] bg-white p-5"><p className="text-sm text-[var(--muted)]">Claimed listings</p><p className="mt-2 text-3xl font-semibold text-[var(--primary)]">{items.length}</p></div>
            <div className="rounded-3xl border border-[var(--border)] bg-white p-5"><p className="text-sm text-[var(--muted)]">Pending listings</p><p className="mt-2 text-3xl font-semibold text-[var(--primary)]">{items.filter((item) => item.status === "pending").length}</p></div>
            <div className="rounded-3xl border border-[var(--border)] bg-white p-5"><p className="text-sm text-[var(--muted)]">Approved listings</p><p className="mt-2 text-3xl font-semibold text-[var(--primary)]">{items.filter((item) => item.status !== "pending").length}</p></div>
          </div>

          <div className="mt-6 grid gap-4">
            {items.length ? items.map((item) => (
              <div key={item.id} className="rounded-3xl border border-[var(--border)] bg-white p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-lg font-semibold">{item.name}</p>
                    <p className="mt-1 text-sm text-[var(--muted)]">{item.category || "Uncategorized"} • Status: {item.status || "approved"}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/owner/business/${item.id}`} className="rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white">Edit listing</Link>
                    <Link href={`/business/${item.id}`} className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold">View public page</Link>
                  </div>
                </div>
              </div>
            )) : <div className="rounded-3xl border border-dashed border-[var(--border)] bg-white p-5 text-sm text-[var(--muted)]">No claimed businesses yet. Claim one from a business detail page.</div>}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
