# Dev Portfolio Maker — Next.js + Strapi (Starter Files)

## Quick start
1. Create a new Next app with Tailwind:
   ```bash
   npx create-next-app@latest my-portfolio-maker --use-npm --tailwind --eslint
   ```
2. Copy the contents of this archive into your new app (merge `/app`, `/lib`, etc.).
3. Create a `.env.local` with:
   ```env
   NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
   STRAPI_URL=http://localhost:1337
   ```
4. Run your Strapi server (v4):
   ```bash
   npx create-strapi-app@latest backend --quickstart
   ```

## Strapi content model (minimum)
- **User** (built-in auth). Leave as is.
- **developer-profiles** (collection type) with fields:
  - `slug` (UID, target field: fullName) — required & unique
  - `fullName` (Text)
  - `headline` (Text)
  - `bio` (Rich Text or Text)
  - `contactEmail` (Email)
  - `avatar` (Media, single)
  - `skills` (JSON) — simple array of `{ name, level }`
  - `user` (Relation: developer-profiles belongs to one User)
- Make sure the `find` and `findOne` permissions are allowed for **Public** role if you want public portfolios visible without auth.

> You can also model **skills** and **projects** as their own collection types or components if you prefer. This starter uses a JSON field for simplicity.

## Routes included
- `POST /api/auth/login` → proxies Strapi `/api/auth/local`, sets `strapi_jwt` HttpOnly cookie.
- `POST /api/auth/register` → proxies Strapi register, sets cookie.
- `POST /api/auth/logout` → clears cookie.
- `POST /api/me/update` → upserts the authenticated user's `developer-profile` by linking it to the user.
- `POST /api/upload` → forwards file uploads to Strapi's upload plugin.

## Protected & public pages
- `/dashboard` (protected by `middleware.js`) → edit profile, skills, avatar; "Save & Publish" creates/updates your profile in Strapi.
- `/u/[slug]` (public) → renders the portfolio from Strapi data. Replace with your migrated React components.

## Migrating your existing React components
Your current Vite project includes components like:
- `HeroSection.jsx`, `Header.jsx`, `AboutSection.jsx`, `SkillsSection.jsx`, `ProjectsSection.jsx`, `ContactSection.jsx`, `Footer.jsx`, `CustomCursor.jsx`

### Steps
1. Copy them into `/components` in the Next app.
2. Ensure any browser-only code uses `"use client"` at the top and avoids SSR-specific APIs.
3. Change hardcoded text/images into **props** (e.g., `name`, `headline`, `avatarUrl`, `skills`) and pass data from `/u/[slug]/page.jsx`.
4. For images from Strapi, prepend `STRAPI_URL` if the URL is relative.
5. Replace any Vite imports like `/src/...` with relative paths or `@` alias if you set one.

## Optional: revalidation webhooks
If you statically render portfolios, configure a Strapi webhook to hit a Next.js route that calls `revalidatePath("/u/" + slug)` when a profile updates.

Happy building!
