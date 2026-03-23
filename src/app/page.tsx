"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageRenderer from "@/components/visual/PageRenderer";
import SearchBar from "@/components/SearchBar";
import { requireDb } from "@/lib/firebase";
import { DEFAULT_SITE_SETTINGS, getPageBySlug, sanitizeSettings } from "@/lib/siteSettings";

export default function Home() {
  const router = useRouter();
  const [settings, setSettings] = useState(DEFAULT_SITE_SETTINGS);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const db = requireDb();
    getDoc(doc(db, "siteSettings", "public"))
      .then((snap) => {
        if (snap.exists()) setSettings(sanitizeSettings(snap.data() as any));
      })
      .catch(() => undefined);
  }, []);

  const page = getPageBySlug(settings, "/") || settings.pages[0];

  const submitSearch = () => {
    const q = search.trim();
    router.push(q ? `/directory?q=${encodeURIComponent(q)}` : "/directory");
  };

  return (
    <>
      <Navbar />
      <main>
        {settings.homeSearch.visible ? (
          <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
            <div className="rounded-[32px] border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-soft)] sm:p-6" style={{ backgroundColor: settings.theme.surface }}>
              <div className="mb-4">
                <h2 className="text-2xl font-semibold text-[var(--primary)]">{settings.homeSearch.title}</h2>
                {settings.homeSearch.description ? <p className="mt-2 text-sm text-[var(--muted)]">{settings.homeSearch.description}</p> : null}
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="flex-1">
                  <SearchBar search={search} setSearch={setSearch} placeholder={settings.homeSearch.placeholder} />
                </div>
                <button type="button" onClick={submitSearch} className="rounded-2xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white">
                  {settings.homeSearch.buttonLabel || "Search directory"}
                </button>
              </div>
            </div>
          </section>
        ) : null}
        <PageRenderer settings={settings} page={page} />
      </main>
      <Footer />
    </>
  );
}
