"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Business = {
  id: string;
  name?: string;
  category?: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  phone?: string;
  website?: string;
  rating?: number | string;
  imageUrl?: string;
  logoUrl?: string;
};

export const dynamic = "force-dynamic";

export default function DirectoryPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function fetchBusinesses() {
      try {
        setLoading(true);
        setError("");

        const snapshot = await getDocs(collection(db, "businesses"));

        const data: Business[] = snapshot.docs.map((doc) => {
          const raw = doc.data() as Omit<Business, "id">;
          return {
            id: doc.id,
            ...raw,
          };
        });

        if (!mounted) return;
        setBusinesses(data);
      } catch (err) {
        console.error("Error loading directory:", err);
        if (!mounted) return;
        setError(
          "Unable to load businesses right now. Check Firebase config, Firestore collection name, and read permissions."
        );
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchBusinesses();

    return () => {
      mounted = false;
    };
  }, []);

  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(
        businesses
          .map((b) => (b.category || "").trim())
          .filter((c) => c.length > 0)
      )
    ).sort();

    return ["All", ...unique];
  }, [businesses]);

  const filteredBusinesses = useMemo(() => {
    const query = search.trim().toLowerCase();

    return businesses.filter((business) => {
      const matchesSearch =
        query.length === 0 ||
        business.name?.toLowerCase().includes(query) ||
        business.category?.toLowerCase().includes(query) ||
        business.description?.toLowerCase().includes(query) ||
        business.address?.toLowerCase().includes(query) ||
        business.city?.toLowerCase().includes(query) ||
        business.state?.toLowerCase().includes(query) ||
        business.zip?.toLowerCase().includes(query);

      const matchesCategory =
        category === "All" || business.category === category;

      return Boolean(matchesSearch && matchesCategory);
    });
  }, [businesses, search, category]);

  function formatRating(value?: number | string) {
    if (value === undefined || value === null || value === "") return "No rating";

    const num =
      typeof value === "number" ? value : Number.parseFloat(String(value));

    return Number.isNaN(num) ? String(value) : `${num.toFixed(1)} ★`;
  }

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <h1 style={styles.title}>Greenwood Directory</h1>
        <p style={styles.subtitle}>Discover businesses in the community.</p>

        <div style={styles.filters}>
          <input
            type="text"
            placeholder="Search by name, category, city, or address"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={styles.select}
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section style={styles.resultsHeader}>
        <p style={styles.countText}>
          {loading
            ? "Loading businesses..."
            : `${filteredBusinesses.length} business${
                filteredBusinesses.length === 1 ? "" : "es"
              } found`}
        </p>
      </section>

      {error ? (
        <div style={styles.messageBoxError}>
          <p style={styles.messageText}>{error}</p>
        </div>
      ) : loading ? (
        <div style={styles.messageBox}>
          <p style={styles.messageText}>Loading directory...</p>
        </div>
      ) : filteredBusinesses.length === 0 ? (
        <div style={styles.messageBox}>
          <p style={styles.messageText}>
            No businesses found. Make sure your Firestore collection is named
            <strong> businesses</strong> and contains documents.
          </p>
        </div>
      ) : (
        <section style={styles.grid}>
          {filteredBusinesses.map((business) => {
            const image = business.logoUrl || business.imageUrl || "";

            return (
              <article key={business.id} style={styles.card}>
                <div style={styles.imageWrap}>
                  {image ? (
                    <img
                      src={image}
                      alt={business.name || "Business image"}
                      style={styles.image}
                    />
                  ) : (
                    <div style={styles.placeholderImage}>No Image</div>
                  )}
                </div>

                <div style={styles.cardBody}>
                  <div style={styles.cardTop}>
                    <h2 style={styles.cardTitle}>
                      {business.name || "Unnamed Business"}
                    </h2>
                    <span style={styles.ratingBadge}>
                      {formatRating(business.rating)}
                    </span>
                  </div>

                  {business.category ? (
                    <p style={styles.category}>{business.category}</p>
                  ) : null}

                  {business.description ? (
                    <p style={styles.description}>{business.description}</p>
                  ) : null}

                  <div style={styles.meta}>
                    {business.address && (
                      <p style={styles.metaText}>
                        {business.address}
                        {business.city ? `, ${business.city}` : ""}
                        {business.state ? `, ${business.state}` : ""}
                        {business.zip ? ` ${business.zip}` : ""}
                      </p>
                    )}

                    {business.phone && (
                      <p style={styles.metaText}>Phone: {business.phone}</p>
                    )}

                    {business.website && (
                      <a
                        href={
                          business.website.startsWith("http")
                            ? business.website
                            : `https://${business.website}`
                        }
                        target="_blank"
                        rel="noreferrer"
                        style={styles.link}
                      >
                        Visit Website
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f6fbf7",
    padding: "32px 20px 60px",
    fontFamily:
      'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  hero: {
    maxWidth: "1100px",
    margin: "0 auto 24px",
    textAlign: "center",
  },
  title: {
    fontSize: "clamp(2rem, 4vw, 3.4rem)",
    fontWeight: 800,
    color: "#0f3d2e",
    marginBottom: "10px",
  },
  subtitle: {
    fontSize: "1rem",
    color: "#4e6b5d",
    marginBottom: "24px",
  },
  filters: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  searchInput: {
    width: "min(680px, 100%)",
    padding: "14px 18px",
    borderRadius: "999px",
    border: "1px solid #cfe1d3",
    fontSize: "1rem",
    outline: "none",
    backgroundColor: "#ffffff",
  },
  select: {
    minWidth: "180px",
    padding: "14px 16px",
    borderRadius: "999px",
    border: "1px solid #cfe1d3",
    fontSize: "1rem",
    backgroundColor: "#ffffff",
    outline: "none",
  },
  resultsHeader: {
    maxWidth: "1100px",
    margin: "0 auto 20px",
  },
  countText: {
    color: "#355748",
    fontSize: "0.95rem",
    margin: 0,
  },
  grid: {
    maxWidth: "1100px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "18px",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow: "0 8px 24px rgba(16, 24, 40, 0.08)",
    border: "1px solid #e7f0e8",
    display: "flex",
    flexDirection: "column",
  },
  imageWrap: {
    width: "100%",
    height: "180px",
    backgroundColor: "#eef6ef",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  placeholderImage: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#6b7f72",
    fontWeight: 600,
    fontSize: "0.95rem",
  },
  cardBody: {
    padding: "18px",
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "12px",
    marginBottom: "8px",
  },
  cardTitle: {
    fontSize: "1.15rem",
    lineHeight: 1.3,
    margin: 0,
    color: "#173b2d",
    fontWeight: 700,
  },
  ratingBadge: {
    whiteSpace: "nowrap",
    backgroundColor: "#e8f7ec",
    color: "#1d6b43",
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "0.85rem",
    fontWeight: 700,
  },
  category: {
    color: "#2f7a53",
    fontSize: "0.92rem",
    fontWeight: 600,
    margin: "0 0 10px 0",
  },
  description: {
    color: "#506458",
    fontSize: "0.95rem",
    lineHeight: 1.5,
    margin: "0 0 14px 0",
  },
  meta: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  metaText: {
    margin: 0,
    color: "#51675a",
    fontSize: "0.92rem",
    lineHeight: 1.45,
  },
  link: {
    color: "#0d6b42",
    textDecoration: "none",
    fontWeight: 700,
    fontSize: "0.94rem",
  },
  messageBox: {
    maxWidth: "1100px",
    margin: "0 auto",
    backgroundColor: "#ffffff",
    border: "1px solid #e7f0e8",
    borderRadius: "18px",
    padding: "24px",
    textAlign: "center",
  },
  messageBoxError: {
    maxWidth: "1100px",
    margin: "0 auto",
    backgroundColor: "#fff4f4",
    border: "1px solid #f1c4c4",
    borderRadius: "18px",
    padding: "24px",
    textAlign: "center",
  },
  messageText: {
    margin: 0,
    color: "#4f5f55",
    fontSize: "1rem",
    lineHeight: 1.5,
  },
};
