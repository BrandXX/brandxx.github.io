# TechSoft Systems Website

This repository contains the source code for the TechSoft Systems website, a professional IT infrastructure and AI solutions company based in Tucson, Arizona.

## Website Structure

The website consists of the following pages:

- **Home** (`index.html`): Main landing page with company overview
- **Company** (`company.html`): Information about TechSoft Systems, core values, and services
- **AI Solutions** (`ai-solutions.html`): Details about AI offerings and capabilities
- **About Me** (`about-me.html`): Professional background of Jonathan Carroll
- **Contact** (`contact.html`): Contact form and direct contact information
- **Resume** (`resume.html`): Professional resume (not linked in main navigation)
- **Cover Letter** (`cover-letter.html`): Professional cover letter (not linked in main navigation)
- **Thank You** (`thank-you.html`): Confirmation page after contact form submission

## Design Elements

### Header Layout

All pages use a consistent two-card header layout with the following structure:

```html
<header class="hero-section">
  <div class="container">
    <div class="hero-flex-container">
      <!-- Main Content Card -->
      <div class="wide-card hero-card main-card">
        <div class="hero-content">
          <p class="tagline">Page Tagline</p>
          <div class="hero-description">
            <p>Descriptive text about the page content.</p>
          </div>
        </div>
      </div>

      <!-- Contact Card -->
      <div class="wide-card contact-card">
        <h3>Contact Us</h3>
        <div class="contact-links">
          <a href="tel:5203024921" class="contact-link phone-link">
            <span class="contact-icon phone-icon"></span>
            <span>(520) 302-4921</span>
          </a>
          <a href="mailto:sales@techsoftsys.com" class="contact-link email-link">
            <span class="contact-icon email-icon"></span>
            <span>sales@techsoftsys.com</span>
          </a>
          <a href="mailto:sales@techsoftsys.com" class="primary-btn schedule-btn">
            <span>Schedule a Consultation</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</header>
```

### Content Card Layout

All content sections use a consistent wide card layout with the following structure:

```html
<div class="wide-card">
  <div class="ai-flex-container">
    <div class="ai-text-content">
      <h2 class="ai-section-title">Section Title</h2>
      <!-- Content goes here -->
    </div>
  </div>
</div>
```

Cards are separated by dividers:

```html
<div class="section-divider"></div>
```

### Image Placement

Images use the following pattern, with the `reverse` class alternating the image position:

```html
<div class="wide-card">
  <div class="ai-flex-container reverse"> <!-- or without reverse -->
    <div class="ai-text-content">
      <!-- Text content -->
    </div>
    <div class="ai-image-wrapper">
      <img src="/images/image-name.png" alt="Description" class="ai-image">
    </div>
  </div>
</div>
```

## Local Development

### Running the Site Locally

To test changes before committing, run the site locally using Python's built-in HTTP server:

1. Navigate to the website directory in your terminal:
   ```bash
   cd /path/to/website
   ```

2. Start the server on port 8181:
   ```bash
   python -m http.server 8181
   ```

   For Python 2 (if applicable):
   ```bash
   python -m SimpleHTTPServer 8181
   ```

3. Open your browser and go to: `http://localhost:8181`

4. Make changes and refresh the browser to see updates

5. When satisfied, commit and push changes

### Alternative: VS Code Live Server

If using Visual Studio Code:

1. Install the "Live Server" extension
2. Right-click on any HTML file and select "Open with Live Server"
3. The site will open in your browser and auto-refresh when files are saved

## Special Features

### Resume and Cover Letter Pages

- These pages are not linked from the main navigation
- They are accessible directly via URLs:
  - `https://techsoftsys.com/resume.html`
  - `https://techsoftsys.com/cover-letter.html`
- They include navigation between each other
- PDF downloads are available for both pages
- Enhanced download buttons with interactive hover effects

### Contact Form

- Uses Formspree.io for processing
- Redirects to thank-you.html after submission

## Maintenance Notes

### Adding New Pages

1. Use the template in the `/templates` directory:
   ```bash
   cp templates/page-template.html new-page-name.html
   ```
2. Follow the instructions in the template comments (look for `<!-- REPLACE: -->`)
3. Update the navigation links as needed
4. Maintain the wide card layout for consistency
5. See `templates/README.md` for detailed instructions

### Adding Images

1. Use PNG format for all images
2. Place images in the `/images` directory
3. Avoid Zone.Identifier files in the repository
4. Use the `ai-image` class for consistent styling
5. Follow the consistent naming convention:
   - Name images after their corresponding sections (e.g., `section-name-image.png`)
   - This makes it clear which image belongs to which section
   - Examples: `enterprise-grade-infrastructure-image.png`, `core-values-image.png`

### Styling Guidelines

- Use the two-card header layout for all pages (main content card and contact card)
- Use the yellow tagline as the primary text element in the hero section
- Apply consistent hover effects to all interactive elements (especially contact links)
- Maintain consistent spacing between sections
- Use yellow accents (`#f6c915`) for highlights and interactive elements
- Keep the dark background theme throughout
- Ensure responsive design works on all device sizes
- Use consistent email addresses (sales@techsoftsys.com for general pages, j.carroll@techsoftsys.com for personal pages)

## Recent Updates

### May 2025 Updates
- Created page template system with detailed documentation for easier page creation
- Implemented new two-card header layout across all pages for a more professional appearance
- Created dedicated contact card in header with phone, email, and schedule button
- Standardized the hero section to use yellow tagline as primary text element
- Removed large white headings for a cleaner, more consistent look
- Fixed email address on AI Solutions page (changed to sales@techsoftsys.com)
- Fixed favicon configuration on AI Solutions page
- Added hover effect to email links to match phone number links
- Added descriptive text to hero sections on all pages
- Cleaned up orphaned image files to reduce repository size
- Fixed capitalization inconsistency in image filenames (why-techSoft-image.png → why-techsoft-image.png)
- Ensured all image references use consistent lowercase naming
- Updated documentation in CSS/README.md and main README.md
- Ensured consistent styling across all pages

### Previous Updates
- Added functional PDF downloads for resume and cover letter pages
- Created professionally formatted PDF versions of resume and cover letter
- Enhanced PDF download buttons with interactive hover effects
- Removed italic formatting from company page tagline for consistent styling
- Added documentation for PDF files in pdfs/README.md
- Implemented consistent image naming convention across all pages
- Added new section images to the Company page (Core Values, Why Choose TechSoft)
- Added new section images to the Home page (Why TechSoft, Results That Matter)
- Fixed email address overflow issue on the contact page
- Created comprehensive documentation in README files for main repo, CSS, and JavaScript
- Set up local development workflow with Python HTTP server on port 8181
- Added wide card layout to all pages for consistent design
- Created resume and cover letter pages with navigation between them
- Enhanced contact page with direct contact information
- Updated thank you page with consistent styling
- Improved navigation and visual hierarchy across all pages

## Contact

For questions about this website, contact Jonathan Carroll at j.carroll@techsoftsys.com.
