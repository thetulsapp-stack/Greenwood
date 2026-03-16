# Greenwood Directory

A polished, sponsor-ready Greenwood directory app built with Next.js, Firebase, Tailwind, and Google Maps.

## Included improvements

- mobile-first homepage with polished sponsor sections
- searchable directory and map view
- business detail pages with reviews and claim requests
- owner auth, dashboard, and listing editor
- admin panel with:
  - business approvals
  - CSV import
  - editable color theme controls
  - drag-and-drop homepage section editor
- partner inquiry page for sponsorship leads
- Vercel-friendly environment variable setup

## Before deployment

1. Copy `.env.example` to `.env.local`
2. Add your Firebase and Google Maps keys
3. In Firebase, enable:
   - Authentication (Email/Password)
   - Firestore
   - Storage
4. Add your admin email to `NEXT_PUBLIC_ADMIN_EMAILS`

## Run locally

```bash
npm install
npm run dev
```

## Deploy to Vercel

1. Push the project to GitHub
2. Import the repo into Vercel
3. Add the environment variables from `.env.example`
4. Connect `localgreenwood.com`
5. Set the primary domain to `localgreenwood.com`

## Notes

- Reviews are stored in Firestore collection `reviews`
- Partner inquiries are stored in `partnerLeads`
- Site-wide editable settings live in `siteSettings/public`
- Business claim requests are stored in `claimRequests`
