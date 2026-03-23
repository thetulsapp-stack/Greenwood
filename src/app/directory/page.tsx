import { Suspense } from "react";
import DirectoryClient from "./DirectoryClient";

function DirectoryFallback() {
  return <div className="p-6">Loading directory...</div>;
}

export default function DirectoryPage() {
  return (
    <Suspense fallback={<DirectoryFallback />}>
      <DirectoryClient />
    </Suspense>
  );
}
