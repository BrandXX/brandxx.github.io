# Page Templates

This directory contains templates for creating new pages on the TechSoft Systems website. Using these templates ensures consistency across the site and makes it easier to add new content.

## Available Templates

- `page-template.html` - Basic page template with standard sections

## How to Use the Template

1. **Copy the Template**:
   ```
   cp templates/page-template.html new-page-name.html
   ```

2. **Find and Replace**:
   Look for `<!-- REPLACE: -->` comments in the template. These indicate areas that need to be customized for your specific page.

3. **Update Navigation**:
   Add the `aria-current="page"` attribute to the navigation link that corresponds to your new page.

4. **Customize Content**:
   - Update the page title
   - Replace the tagline and description in the hero section
   - Add your specific content sections
   - Update images with appropriate paths and alt text

5. **Section Types**:
   The template includes examples of different section types:
   - Basic text section
   - Text with right image
   - Text with left image (using the `reverse` class)
   - Call to action section

## Image Naming Convention

When adding images to your new page, follow the established naming convention:
- Use descriptive names that indicate the section they belong to
- Format: `section-name-image.png`
- Use all lowercase with hyphens between words
- Example: `enterprise-grade-infrastructure-image.png`

## Contact Information

- Use `sales@techsoftsys.com` for general pages
- Use `j.carroll@techsoftsys.com` for personal/about pages

## Best Practices

1. **Maintain Consistent Structure**:
   - Keep the two-card header layout
   - Use the yellow tagline as the primary text element
   - Maintain consistent spacing between sections

2. **Alternate Image Placement**:
   - Use the standard layout (image on right) for the first content section
   - Use the reverse layout (image on left) for the second section
   - Continue alternating for visual interest

3. **Section Dividers**:
   - Always include a section divider (`<div class="section-divider"></div>`) between content sections

4. **Responsive Testing**:
   - Test your new page on mobile, tablet, and desktop views
   - Ensure images and text display properly at all screen sizes

## Example Usage

Here's a quick example of how to replace content in a section:

```html
<!-- Original in template -->
<h2 class="ai-section-title">Section Title</h2>
<p>
  Section content goes here. This can include paragraphs, lists, or other HTML elements.
</p>

<!-- Your replacement -->
<h2 class="ai-section-title">Our Services</h2>
<p>
  TechSoft Systems offers a comprehensive range of IT infrastructure and AI solutions
  tailored to meet the unique needs of your business.
</p>
<ul>
  <li>Infrastructure design and implementation</li>
  <li>Cloud migration and management</li>
  <li>AI integration and deployment</li>
</ul>
```

## Additional Section Templates

### Services Grid

```html
<div class="services-grid">
  <div class="service-card">
    <h4>Service Title</h4>
    <ul>
      <li>Feature one</li>
      <li>Feature two</li>
      <li>Feature three</li>
    </ul>
  </div>
  
  <!-- Add more service cards as needed -->
</div>
```

### Numbered List

```html
<ol class="benefits-list">
  <li><strong>Benefit title</strong> – Description of the benefit.</li>
  <li><strong>Another benefit</strong> – More details about why this matters.</li>
  <li><strong>Third benefit</strong> – Additional information about this point.</li>
</ol>
```

### Results List

```html
<ul class="results-list">
  <li><strong>Statistic or number</strong> brief description of the achievement.</li>
  <li><strong>Another metric</strong> explanation of what was accomplished.</li>
  <li><strong>Third result</strong> details about the impact.</li>
</ul>
```
