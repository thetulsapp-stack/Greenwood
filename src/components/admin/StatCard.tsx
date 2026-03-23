
export default function StatCard({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="rounded-[28px] border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-soft)]">
      <p className="text-sm font-medium text-[var(--muted)]">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-[var(--primary)]">{value}</p>
      {hint ? <p className="mt-2 text-sm text-[var(--muted)]">{hint}</p> : null}
    </div>
  );
}
