
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdminShell from "@/components/admin/AdminShell";
import StatCard from "@/components/admin/StatCard";
import { hasAdminAccess } from "@/lib/admin";
import { useAuth } from "@/lib/useAuth";
import { loadBusinesses, loadClaims, loadReviews } from "@/lib/adminData";
import { DEFAULT_SITE_SETTINGS } from "@/lib/siteSettings";
import { cssThemeVars } from "@/lib/colors";

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const canAccess = hasAdminAccess(user?.email);
  const [counts, setCounts] = useState({ businesses: 0, pending: 0, claims: 0, reviews: 0, owners: 0 });

  useEffect(() => {
    if (!canAccess) return;
    Promise.all([loadBusinesses(), loadClaims(), loadReviews()]).then(([businesses, claims, reviews]) => {
      setCounts({
        businesses: businesses.length,
        pending: businesses.filter((item) => item.status === "pending").length,
        claims: claims.filter((item) => item.status !== "approved").length,
        reviews: reviews.length,
        owners: businesses.filter((item) => item.ownerUid).length,
      });
    }).catch(() => undefined);
  }, [canAccess]);

  return (
    <div style={cssThemeVars(DEFAULT_SITE_SETTINGS.theme)}>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {authLoading ? <div className="rounded-[28px] border border-[var(--border)] bg-white p-8">Loading admin access…</div> : null}
        {!authLoading && !user ? (
          <div className="rounded-[28px] border border-[var(--border)] bg-white p-8">
            <p className="text-[var(--text)]">Please log in to access Greenwood admin.</p>
            <Link href="/admin/login" className="mt-4 inline-flex rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white">Go to admin login</Link>
          </div>
        ) : null}
        {!authLoading && user && !canAccess ? <div className="rounded-[28px] border border-[var(--border)] bg-white p-8">This admin area is restricted to approved admin emails. Add your email to <code>NEXT_PUBLIC_ADMIN_EMAILS</code>.</div> : null}

        {canAccess ? (
          <AdminShell title="Admin dashboard" description="Keep the visual editor the same, and run Greenwood operations from a separate dashboard.">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              <StatCard label="Businesses" value={counts.businesses} />
              <StatCard label="Pending approvals" value={counts.pending} />
              <StatCard label="Claim requests" value={counts.claims} />
              <StatCard label="Reviews" value={counts.reviews} />
              <StatCard label="Claimed listings" value={counts.owners} />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-[28px] border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-soft)]">
                <h2 className="text-xl font-semibold text-[var(--primary)]">Quick actions</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <Link href="/admin/listings" className="rounded-2xl bg-[var(--primary)] px-4 py-3 text-center text-sm font-semibold text-white">Manage listings</Link>
                  <Link href="/admin/submissions" className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-center text-sm font-semibold text-[var(--primary)]">Review submissions</Link>
                  <Link href="/admin/claims" className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-center text-sm font-semibold text-[var(--primary)]">Approve claims</Link>
                  <Link href="/admin/categories" className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-center text-sm font-semibold text-[var(--primary)]">Edit filters</Link>
                  <Link href="/admin/reviews" className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-center text-sm font-semibold text-[var(--primary)]">Moderate reviews</Link>
                  <Link href="/admin/editor" className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-center text-sm font-semibold text-[var(--primary)]">Open visual editor</Link>
                </div>
              </div>

              <div className="rounded-[28px] border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-soft)]">
                <h2 className="text-xl font-semibold text-[var(--primary)]">Role lanes</h2>
                <div className="mt-4 grid gap-4">
                  <div className="rounded-2xl border border-[var(--border)] p-4">
                    <p className="font-semibold text-[var(--text)]">Admin tools</p>
                    <p className="mt-2 text-sm text-[var(--muted)]">Listings, moderation, category management, request approvals, and settings.</p>
                  </div>
                  <div className="rounded-2xl border border-[var(--border)] p-4">
                    <p className="font-semibold text-[var(--text)]">Visual editor</p>
                    <p className="mt-2 text-sm text-[var(--muted)]">Still separate at /admin/editor so design controls do not replace operations.</p>
                  </div>
                  <div className="rounded-2xl border border-[var(--border)] p-4">
                    <p className="font-semibold text-[var(--text)]">Owner dashboard</p>
                    <p className="mt-2 text-sm text-[var(--muted)]">Business owners manage only their own listings from a separate view.</p>
                  </div>
                </div>
              </div>
            </div>
          </AdminShell>
        ) : null}
      </main>
      <Footer />
    </div>
  );
}
