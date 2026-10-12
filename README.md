# TechSoft Systems Marketing Site

Modern Astro + Tailwind marketing site for TechSoft Systems, focused on private AI infrastructure, reliability engineering, and training services.

## Tech Stack

- Astro
- Tailwind CSS
- TypeScript
- MDX content collections
- Minimal JS (theme toggle and accessible navigation)

## Approved Brand Release (October 2026)

The complete branded site was approved for publication on October 11, 2026.
It stays on the existing GitHub Pages workflow and custom domain. The release
includes the latest published research and PDF updates from `e609c0c`, not the
older copies from the initial staging branch. The prior live version remains
recoverable from that commit and the local `codex/pre-brand-live-2026-10-11`
branch. Rollback should revert the release commit, preserving later independent
changes, then redeploy through the same Pages workflow.

Scope: homepage, About page, shared navigation/footer, theme behavior, document
presentation, favicon/social assets, self-hosted Inter, and Lucide icons. Existing inner-page content and routes are
retained. Resume, research, cover letter, PDFs, and the Defiantly Not Regex
artwork/essays are canonical references: their text, source files, and downloads
are not edited by this redesign. Their built HTML receives the approved site shell.
Homepage research summaries derive only from those public references. Independent
R&D is not presented as a commercial deployment or a guaranteed outcome.

The v1.1.1 kit's 29 deployment assets are copied unchanged into `public/branding/`.
The hero additionally uses its raster TS mark, not a stock photograph of a lab.
Original v1.0, v1.1, and v1.1.1 ZIPs are preserved in Git-ignored
`source-docs/branding/`, outside `public/` and the static build. No scripts or
deployment prompts from the archives are executed. Inter and Lucide license
notices are included with the public branding assets.

### Full Local Preview

The production and local-preview builds now use the same document renderer,
`scripts/theme-documents.mjs`. `npm run build` builds Astro into `dist/`, applies
the approved presentation, and checks production indexing, domain, downloads,
and archive exclusion. The renderer preserves each article's complete markup.
Canonical source files and PDF downloads retain their original presentation.
Local comparison builds remain separate in `.staging/` and never replace `dist/`.

Start the complete preview and an original-style comparison together:

```bash
npm run preview:full
```

- Themed site: `http://127.0.0.1:4326/`
- Original document styling: `http://127.0.0.1:4327/`

Keep that terminal running. Ctrl+C stops both servers; running the same command
rebuilds and restarts them. They are local processes, not permanent hosting, and
need restarting after a machine/session shutdown. If a port is occupied, the
command exits without stopping any existing process. Choose other ports with
`PREVIEW_PORT=4328 ORIGINAL_PORT=4329 npm run preview:full`.

Each preview build preserves timestamped copies of all canonical document
sources and the complete unthemed static build in `.staging/archive/`. SHA-256
manifests verify source preservation; `.staging/latest.json` points to the latest
snapshot. These files are Git-ignored, outside `public/`, and outside both served
roots. Do not delete the archive when cleaning preview output. Existing private
career records stay in their original local archive, not in the website.

The shared renderer uses an HTML parser to retain each article's complete markup
and links while applying the new site shell. It adds document navigation,
top/bottom printing, and existing PDF downloads. The rollover artwork remains
unchanged. Print buttons open the browser print dialog for the current
document in one click without navigation or substituting condensed wording.
The separate `/resume-print/` route and existing PDF downloads remain available
and unchanged. Shared rules also align the other existing site pages. Both local
servers bind only to loopback; output has `noindex`, a disallow-all `robots.txt`,
and no CNAME/sitemap. Production retains its domain, sitemap, and indexability;
the condensed print route retains its original `noindex, follow` policy.

While the servers are running:

```bash
npm run test:preview
npm run test:site
RESUME_BASE_URL=http://127.0.0.1:4327 npm run test:resume
```

Preview screenshots and print samples go to `/tmp/techsoft-full-preview`.
`test:preview` checks content/source/archive parity, PDF byte preservation,
links, top/bottom print behavior, themes, rollover, mobile layouts, and enlarged
text. The original resume suite runs on port 4327 because it deliberately asserts
the canonical document styling. No PDF-regeneration flags are used.

Implementation: `scripts/theme-documents.mjs`, `scripts/build-preview.mjs`, `scripts/preview-full.mjs`, and
`preview/documents.css` / `preview/documents.js`. `npm run build:preview` generates
the isolated outputs without starting servers. `npm run preview:full -- --no-build`
restarts servers using existing outputs.

### Standard Build Review

For the complete production build, use a free port:

```bash
npm run build
npm run preview -- --host 127.0.0.1 --port 4328
```

Open `http://127.0.0.1:4328/`. Keep the preview command running in one terminal;
run checks in another:

```bash
SITE_BASE_URL=http://127.0.0.1:4328 npm run test:site
SITE_MODE=production SITE_BASE_URL=http://127.0.0.1:4328 npm run test:preview
```

Generate the comparison archive with `npm run build:preview` and keep the original
comparison server running on port 4327 for `test:preview`. Run the original
`test:resume` suite against port 4327, not the new production presentation.

`test:site` checks mobile/desktop layouts, enlarged text, local routes and fragments,
navigation, theme persistence, blocked storage, self-hosted fonts, and no-JS menu
access. Screenshots go to `/tmp/techsoft-site-preview`. Set `SITE_BASE_URL` and
`SITE_SCREENSHOTS` to change the target or destination. Use the built preview for
release checks: Astro's dev server does not resolve the legacy static thesis
directory URL the same way as the static preview. For live editing, use
`npm run dev -- --host 127.0.0.1 --port 4325` and rebuild before reviewing port 4328.

### Dependency Maintenance

On October 11, 2026, the baseline
and staging lockfiles both reported the same 26 npm audit findings (1 critical,
20 high, 3 moderate, 2 low); these additions introduce no new reported findings.
The current release is static HTML/assets only: no server adapter, request-time
code, user uploads, or `astro:assets` image processing. The critical Astro/Sharp
[AVIF advisory](https://github.com/advisories/GHSA-26w7-cxv4-gfx2) requires processing
an attacker-controlled AVIF; that path is not used by this build. The
[Vite WebSocket advisory](https://github.com/advisories/GHSA-p9ff-h696-f583) concerns
the development server, not the deployed static files. These scope limits do not
make the dependency audit clean. Keep local servers on loopback and schedule a
separate tested Astro/build-toolchain upgrade. Reassess before enabling image
optimization, server rendering, untrusted build inputs, or externally exposed dev
servers. No unrelated major dependency upgrades were included in this release.

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
- Homepage presentation: `src/styles/home.css`
- Shared brand/navigation/footer presentation: `src/styles/brand.css`
- Navigation and footer: `src/components/Navbar.astro`, `src/components/Footer.astro`
- Contact CTA links: `src/pages/index.astro` and `src/pages/contact.astro`

### About TechSoft Systems

`src/pages/about.astro` and `src/styles/about.css` present the company's history,
current independent AI R&D focus, founder background, and engineering approach.
The approved October 11, 2026 page derives from the comprehensive master resume,
particularly TechSoft/TBM history, founder employment, lab origin, and research
stage notes. Private source records remain outside the repository and are not
imported or copied into the build. The prior placeholder source is retained
locally in `.staging/about-original.astro` and in Git history.

Keep TechSoft's 2012 founding distinct from Johnathan's 25+ years of experience
and the dedicated lab's January 2025 start. Attribute the 24-hour TBM recovery to
the historical TechSoft engagement and the savings/footprint results to the
Tribal role. Current independent R&D and developing governance/pilot work must
not become claims of completed commercial AI deployments. The site release was
approved separately; that approval does not authorize changes to private records.

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
- Shared OG image: `public/branding/og-image.png` (legacy `public/og.png` retained)

## GitHub Pages Deployment

Workflow: `.github/workflows/deploy.yml`

On push to `main`, the workflow:

1. Installs dependencies
2. Builds Astro output into `dist/`, applies the shared document theme, and runs production guards
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

The resume is rendered by Astro from the public-only presentation in
`src/data/publicResume.ts`. Private career records and source archives do not
belong in this repository.

- `/resume` - public resume and selected research highlights
- `/resume-research` - qualified project details and local benchmark methodology
- `/resume-print` - two-page general resume used to generate the downloadable PDF
- `/resume.html` - compatibility redirect to `/resume` (legacy root copy matches)

The cover letter remains a static file in `public/`:

- `/cover-letter.html`
- `/cover_letter.html` (compatibility redirect)

Canonical resume, research, print, and cover-letter sources share
`public/resume.css` and `public/resume-navigation.css`. The production renderer
replaces only their outer shell with the shared brand and document controls,
copies `preview/documents.*` to `/document-assets/`, and retains the canonical
print stylesheet. Keep the shared header structure and stable scrollbar gutter
aligned across documents to avoid jumps when navigating.
The root `cover-letter.html` copy matches the public file for legacy reference.

To verify and regenerate the resume PDF:

1. Run `npm ci` and `npx playwright install chromium`.
2. Start `npm run dev -- --host 127.0.0.1 --port 4322`.
3. Run `npm run test:resume` for desktop/mobile, theme, navigation, disclosure,
   asset, and print checks; screenshots default to `/tmp/resume-preview`.
4. Run `npm run resume:pdf` to update `public/pdfs/johnathan-carroll-resume.pdf`
   from the same public data. Set `RESUME_BASE_URL` for a different preview URL.
5. Run `npm run build` after PDF generation so the build contains the new file.

Use `npm run cover-letter:pdf` to regenerate the cover-letter download from the
same reviewed local HTML. To regenerate both PDFs in one verification pass, run
`npm run test:resume -- --pdf --cover-pdf`. These are local review artifacts;
generating them does not authorize publication.

Local edits and PDF generation are review artifacts, not deployment approval.
Do not push to `main` or dispatch deployment until publication is approved.

## Legacy Assets

Legacy images and PDFs were preserved and moved to:

- `public/images`
- `public/pdfs`
