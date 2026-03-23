
import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { normalizeBusiness, type BusinessRecord } from "@/lib/business";

export type ClaimRecord = { id: string; businessId?: string; businessName?: string; ownerUid?: string | null; ownerEmail?: string | null; status?: string };
export type ReviewRecord = { id: string; businessId?: string; authorName?: string; comment?: string; rating?: number; flagged?: boolean };

export async function loadBusinesses() {
  if (!db) return [] as BusinessRecord[];
  const snap = await getDocs(collection(db, "businesses"));
  return snap.docs.map((d) => normalizeBusiness({ id: d.id, ...(d.data() as any) }));
}

export async function loadClaims() {
  if (!db) return [] as ClaimRecord[];
  const snap = await getDocs(collection(db, "claimRequests"));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) } as ClaimRecord));
}

export async function loadReviews() {
  if (!db) return [] as ReviewRecord[];
  const snap = await getDocs(query(collection(db, "reviews"), orderBy("createdAt", "desc")));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) } as ReviewRecord));
}

export async function updateBusiness(id: string, patch: Record<string, any>) {
  if (!db) throw new Error("Firebase is not configured.");
  await updateDoc(doc(db, "businesses", id), { ...patch, updatedAt: serverTimestamp() });
}

export async function updateClaim(id: string, patch: Record<string, any>) {
  if (!db) throw new Error("Firebase is not configured.");
  await updateDoc(doc(db, "claimRequests", id), { ...patch, updatedAt: serverTimestamp() });
}

export async function deleteClaim(id: string) {
  if (!db) throw new Error("Firebase is not configured.");
  await deleteDoc(doc(db, "claimRequests", id));
}

export async function deleteReview(id: string) {
  if (!db) throw new Error("Firebase is not configured.");
  await deleteDoc(doc(db, "reviews", id));
}

export async function createCategory(name: string) {
  if (!db) throw new Error("Firebase is not configured.");
  await addDoc(collection(db, "directoryCategories"), { name, createdAt: serverTimestamp(), active: true });
}
