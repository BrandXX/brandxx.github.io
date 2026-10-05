# PDF Documents

This directory contains PDF documents for download from the TechSoft Systems website.

## Current PDF Files

- `johnathan-carroll-resume.pdf` - Resume PDF for download from the resume page
- `johnathan-carroll-cover-letter.pdf` - Cover Letter PDF for download from the cover letter page

## PDF Generation

These are professionally formatted PDF files containing the resume and cover letter content:

1. The resume PDF is the shorter general version rendered at `/resume-print`,
   using the same public-only data as `/resume`; extended research is at
   `/resume-research`. The cover letter is unchanged.
2. They are formatted for professional presentation and printing
3. The filenames are consistent with the HTML links

## Usage

These PDFs are linked from:

- `/resume` - Links to `johnathan-carroll-resume.pdf`; `/resume.html` redirects there
- `cover-letter.html` - Links to `johnathan-carroll-cover-letter.pdf`

The download links include the `download` attribute to prompt the browser to download the file rather than opening it in a new tab.

## Updating PDFs

When updating the content of these PDFs:

1. Maintain the same filenames to avoid having to update the HTML links
2. Ensure the PDFs are properly formatted and professional in appearance
3. Keep file sizes reasonable (ideally under 1MB) for fast downloads

For the resume, start the local preview on port 4322 and run `npm run resume:pdf`.
This runs the browser checks and generates the two-page PDF from `/resume-print`.
Run `npm run build` afterward. See the root README for setup and alternate URLs.

## Future Improvements

Consider adding:

- Version tracking for PDF documents
- Additional formats (DOCX, etc.) if needed
- Print-optimized versions
