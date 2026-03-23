
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdminShell from "@/components/admin/AdminShell";
import { DEFAULT_SITE_SETTINGS } from "@/lib/siteSettings";
import { cssThemeVars } from "@/lib/colors";

export default function SettingsPage() {
  return <div style={cssThemeVars(DEFAULT_SITE_SETTINGS.theme)}><Navbar /><main className="mx-auto max-w-7xl px-4 py-6 sm:px-6"><AdminShell title="Settings shortcuts" description="Use this page as the polished control hub for the pieces you already have."><div className="grid gap-4 md:grid-cols-2"><Link href="/admin/editor" className="rounded-[28px] border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-soft)]"><p className="text-xl font-semibold text-[var(--primary)]">Visual editor</p><p className="mt-2 text-sm text-[var(--muted)]">Open the original editor unchanged.</p></Link><Link href="/admin/categories" className="rounded-[28px] border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-soft)]"><p className="text-xl font-semibold text-[var(--primary)]">Directory filters</p><p className="mt-2 text-sm text-[var(--muted)]">Manage categories reflected on submit and directory pages.</p></Link></div></AdminShell></main><Footer /></div>;
}
