
"use client";

import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdminShell from "@/components/admin/AdminShell";
import { useAuth } from "@/lib/useAuth";
import { hasAdminAccess } from "@/lib/admin";
import { db } from "@/lib/firebase";
import { DEFAULT_SITE_SETTINGS, sanitizeSettings } from "@/lib/siteSettings";
import { cssThemeVars } from "@/lib/colors";

export default function CategoriesPage() {
  const { user } = useAuth();
  const canAccess = hasAdminAccess(user?.email);
  const [categories, setCategories] = useState<string[]>([]);
  const [nextCategory, setNextCategory] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!canAccess || !db) return;
    getDoc(doc(db, "siteSettings", "public")).then((snap) => {
      const settings = snap.exists() ? sanitizeSettings(snap.data() as any) : DEFAULT_SITE_SETTINGS;
      setCategories(settings.categories || []);
    }).catch(() => setCategories(DEFAULT_SITE_SETTINGS.categories));
  }, [canAccess]);

  const save = async (next: string[]) => {
    if (!db) throw new Error("Firebase is not configured.");
    setCategories(next);
    const snap = await getDoc(doc(db, "siteSettings", "public"));
    const current = snap.exists() ? sanitizeSettings(snap.data() as any) : DEFAULT_SITE_SETTINGS;
    await setDoc(doc(db, "siteSettings", "public"), { ...current, categories: next }, { merge: true });
    setMessage("Categories saved. Directory filters will use this list.");
  };

  return <div style={cssThemeVars(DEFAULT_SITE_SETTINGS.theme)}><Navbar /><main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">{canAccess ? <AdminShell title="Categories and filters" description="These categories feed the submit form and the public directory filter."><div className="rounded-[28px] border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-soft)]">{message ? <div className="mb-4 rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-emerald-800">{message}</div> : null}<div className="flex flex-col gap-3 sm:flex-row"><input value={nextCategory} onChange={(e) => setNextCategory(e.target.value)} placeholder="Add a category" className="flex-1 rounded-2xl border border-[var(--border)] bg-white px-4 py-3" /><button onClick={() => { const value = nextCategory.trim(); if (!value || categories.includes(value)) return; save([...categories, value]); setNextCategory(""); }} className="rounded-2xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white">Add category</button></div><div className="mt-5 flex flex-wrap gap-3">{categories.map((category) => <div key={category} className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-alt)] px-4 py-2 text-sm"><span>{category}</span><button onClick={() => save(categories.filter((item) => item !== category))} className="font-semibold text-red-700">×</button></div>)}</div></div></AdminShell> : <div className="rounded-[28px] border border-[var(--border)] bg-white p-8">Admin access required.</div>}</main><Footer /></div>;
}
