# Greenwood clean patch audit

## What was patched
- Split `src/app/directory/page.tsx` into a Suspense wrapper plus `src/app/directory/DirectoryClient.tsx`.
- This fixes the App Router production-build issue caused by `useSearchParams()` being used directly in the page component.
- Kept the existing Greenwood directory flow and filters intact.

## Key flow improvements
- Directory search params are now isolated in a client component.
- The route can prerender safely while still supporting query-string filters.
- Existing Firebase data loading and filter UX remain unchanged.

## Project cleanup packaging
The packaged version excludes:
- `node_modules`
- `.next`
- `.git`
- `.env.local`
- macOS zip metadata folders

## Recommended next steps
1. Deploy this clean package.
2. Confirm `/directory` builds successfully on Vercel.
3. After deploy, audit admin flows next: login, category management, business approval, and editor publishing.
4. Move geocoding to a server route later if you want tighter API-key control.

## Validation completed here
- TypeScript check passed with `npx tsc --noEmit`.

## Limitation in this environment
A full local `next build` could not be completed in this container because Next.js attempted to download an SWC binary and npm registry access is restricted here. The concrete production issue you previously surfaced was addressed directly.
