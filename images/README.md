# Images Directory

This directory contains all image assets for the TechSoft Systems website, including favicons and content images.

## Image Naming Convention

All content images follow a consistent naming convention:
- Names are descriptive of the section they belong to
- Format: `section-name-image.png`
- All lowercase with hyphens between words
- Examples: `enterprise-grade-infrastructure-image.png`, `why-techsoft-image.png`

## Current Favicon Files

- `favicon.svg` - SVG version of the favicon (modern browsers)
- `favicon.ico` - ICO placeholder file

## Converting SVG to ICO

For better browser compatibility, you should convert the SVG to a proper ICO file:

1. Use an online converter like [RealFaviconGenerator](https://realfavicongenerator.net/) or [Favicon.io](https://favicon.io/)
2. Upload the SVG file
3. Download the generated ICO file and other formats
4. Replace the placeholder `favicon.ico` with the generated file

## Additional Favicon Formats (Optional)

For comprehensive device support, you might want to generate these additional formats:

- `apple-touch-icon.png` (180×180) for iOS devices
- `favicon-32x32.png` (32×32)
- `favicon-16x16.png` (16×16)
- `android-chrome-192x192.png` (192×192) for Android
- `android-chrome-512x512.png` (512×512) for Android

If you add these formats, update the HTML head section in all pages with the appropriate link tags.

## Image Maintenance

### May 2025 Cleanup
- Removed 8 orphaned image files that were no longer referenced in the website
- Fixed capitalization inconsistency (renamed `why-techSoft-image.png` to `why-techsoft-image.png`)
- Updated all HTML references to use consistent lowercase naming

### Best Practices
- Use PNG format for all content images
- Maintain consistent naming convention (section-name-image.png)
- Ensure all filenames use lowercase letters and hyphens
- Remove orphaned images when they are no longer needed
- Avoid Zone.Identifier files in the repository
