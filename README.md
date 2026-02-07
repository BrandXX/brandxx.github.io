# TechSoft Systems Marketing Site

Modern Astro + Tailwind marketing site for TechSoft Systems, focused on private AI infrastructure, reliability engineering, and training services.

## Tech Stack

- Astro
- Tailwind CSS
- TypeScript
- MDX content collections
- Minimal JS (theme toggle only)

## Install / Dev / Build

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Routes

- `/`
- `/work`
- `/work/[slug]`
- `/services`
- `/training`
- `/ai-lab`
- `/open-source`
- `/about`
- `/contact`
- `/404`

## Content Editing

### Update homepage copy + stats + CTAs

- Homepage layout/content: `src/pages/index.astro`
- Proof strip stats: `src/components/ProofStrip.astro`
- Reference stack card: `src/components/StackCard.astro`
- Contact CTA links: `src/components/CTA.astro` and `src/pages/contact.astro`

### Add or edit case studies

Case studies live in `src/content/case-studies/*.mdx`.

Each entry should include:

1. Context
2. Problem
3. Approach
4. Architecture (bullets)
5. Architecture Diagram Placeholder
6. Results and Metrics
7. Tools and Stack
8. Lessons Learned

Required frontmatter fields are defined in `src/content/config.ts`.

## SEO / Metadata

- Global site metadata: `src/config/site.ts`
- Canonical + OG + Twitter tags: `src/layouts/BaseLayout.astro`
- Sitemap generation: `astro.config.mjs` with `@astrojs/sitemap`
- Robots rules: `public/robots.txt`
- OG placeholder image: `public/og.png`

## GitHub Pages Deployment

Workflow: `.github/workflows/deploy.yml`

On push to `main`, the workflow:

1. Installs dependencies
2. Builds Astro output into `dist/`
3. Uploads Pages artifact
4. Deploys to GitHub Pages

### GitHub Pages setup

1. In GitHub repo settings, open `Pages`.
2. Set source to `GitHub Actions`.
3. Push to `main` to trigger deployment.

## Custom Domain

- Domain file: `public/CNAME`
- Current value: `techsoftsys.com`

If you need to change or remove custom domain usage, edit or delete `public/CNAME`.

## Resume and Cover Letter URLs

These static pages are published directly from `public/`:

- `/resume.html`
- `/cover-letter.html`
- `/cover_letter.html` (compatibility alias)

## Legacy Assets

Legacy images and PDFs were preserved and moved to:

- `public/images`
- `public/pdfs`
