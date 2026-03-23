# Greenwood patched project

What was updated:
- merged the separate admin dashboard routes back into the project
- kept the visual editor available at `/admin/editor`
- made Firebase access safer with `requireDb`, `requireAuth`, and `requireStorage`
- patched nullable Firebase runtime crashes across directory, business, submit, owner, navbar, footer, and editor flows
- fixed owner and auth pages to use guarded Firebase helpers
- added admin routes for listings, submissions, claims, categories, reviews, and settings
- kept the owner dashboard and owner business edit flow

What I verified:
- `npx tsc --noEmit` passes successfully

What I could not fully verify here:
- full `next build` in this container, because the environment blocks the SWC package download step that Next tries to perform

After swapping this project locally:
1. copy your `.env.local` back if needed
2. run `npm install`
3. run `npm run dev`
4. test:
   - `/admin`
   - `/admin/editor`
   - `/owner/dashboard`
   - `/directory`
   - `/submit`
5. then push to git
