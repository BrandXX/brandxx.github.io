# PDF Documents

This directory contains PDF documents for download from the TechSoft Systems website.

## Current PDF Files

- `johnathan-carroll-resume.pdf` - Resume PDF for download from the resume page
- `johnathan-carroll-cover-letter.pdf` - Cover Letter PDF for download from the cover letter page
- `johnathan-carroll-applied-ai-research.pdf` - Applied AI Research PDF for download from the research page

## PDF Generation

The current downloads are the approved, uniform employer-facing set published October 6, 2026:

1. Resume: three pages; cover letter: one page; applied AI research: four pages.
2. All three use consistent formatting, selectable text, embedded fonts, and
   clickable contact and online-document links. The research PDF includes
   internal section links and outline bookmarks.
3. The approved PDFs are exported from editable document sources maintained
   privately, not regenerated from the web print views. DOCX sources and private
   career evidence are not published here.

## Usage

These PDFs are linked from:

- `/resume` - Links to `johnathan-carroll-resume.pdf`; `/resume.html` redirects there
- `cover-letter.html` - Links to `johnathan-carroll-cover-letter.pdf`
- `/resume-research` - Links to `johnathan-carroll-applied-ai-research.pdf`

The download links include the `download` attribute to prompt the browser to download the file rather than opening it in a new tab.

## Updating PDFs

When updating the content of these PDFs:

1. Maintain the same filenames to avoid having to update the HTML links
2. Ensure the PDFs are properly formatted and professional in appearance
3. Keep file sizes reasonable (ideally under 1MB) for fast downloads

Replace these files only with a newly reviewed and approved document export.
Run `npm run build` and `npm run test:resume` against a local preview before
publishing; the checks verify each download's link, bytes, and page count.

`npm run resume:pdf` and `npm run cover-letter:pdf` are legacy web-print
generators and overwrite the corresponding downloads. Do not use them to
refresh this approved document set. The site's Print controls still use the
web print views, independently of these PDF downloads.

## Future Improvements

Consider adding:

- Version tracking for PDF documents
- Additional formats (DOCX, etc.) if needed
- Print-optimized versions
