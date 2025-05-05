# CSS Documentation

This folder contains the stylesheet for the TechSoft Systems website. The CSS is organized into logical sections for better maintainability and readability.

## File Structure

- `styles.css` - Main stylesheet containing all styles for the website

## CSS Organization

The CSS is organized into the following major sections:

### 1. Global Styles
- Base styling for all elements
- CSS reset properties
- Color variables and common properties
- Box-sizing rules

### 2. Layout & Containers
- Main container definitions
- Grid and flex layouts
- Section dividers
- Spacing utilities

### 3. Navigation
- Top navigation bar
- Mobile hamburger menu (appears on screens ≤768px)
- Mobile slide-out navigation panel
- Active state styling
- Responsive adjustments

### 4. Typography
- Headings (h1-h6)
- Paragraph styles
- Link styling
- Font weights and sizes

### 5. Hero Section
- Two-card layout with main content and contact information
- Hero background and animations
- Yellow tagline as primary text element
- Contact card with phone, email, and schedule button
- Consistent hover effects for all contact links
- Consistent layout across all pages

### 6. Buttons & Call to Action
- Primary and secondary buttons
- Hover and active states
- Button sizing and spacing
- Link buttons

### 7. Services Grid
- Service card layouts
- Grid spacing and responsiveness
- Service icons and titles
- Hover effects

### 8. AI Solutions Page
- Feature lists
- Solution blocks
- Package tables
- Quote styling

### 9. Wide Card Layout
- Card containers
- Flex container for content/image arrangement
- Text content styling
- Section titles

### 10. Image Handling
- Image wrappers with the `.ai-image-wrapper` class
- Image positioning using the `.reverse` class for alternating left/right placement
- Image sizing with the `.ai-image` class for consistent dimensions
- Subtle glow effect on images for visual polish
- Consistent naming convention for image files (section-name-image.png)

### 11. Contact Page
- Form styling
- Input fields and labels
- Contact details grid
- Form validation

### 12. Resume & Cover Letter
- Document navigation
- Section styling
- Download links
- Content formatting

### 13. Thank You Page
- Thank you message styling
- Redirect notice
- Return button

### 14. Responsive Design
- Media queries for different screen sizes
- Mobile-specific adjustments
- Tablet breakpoints
- Desktop optimizations

## CSS Naming Conventions

The CSS follows these naming conventions:

- `.container` - Main content container
- `.section-divider` - Horizontal divider between sections
- `.wide-card` - Card-style content container
- `.hero-flex-container` - Flexbox container for hero section cards
- `.main-card` - Left card in hero section containing main content
- `.contact-card` - Right card in hero section containing contact information
- `.contact-links` - Container for contact links in contact card
- `.contact-link` - Individual contact link (phone, email)
- `.contact-icon` - Icon for contact links
- `.schedule-btn` - Schedule button in contact card
- `.ai-flex-container` - Flexbox container for content and images
- `.ai-text-content` - Text content within flex containers
- `.ai-image-wrapper` - Image wrapper within flex containers
- `.ai-section-title` - Section headings
- `.reverse` - Modifier class to reverse flex direction
- `.mobile-menu-toggle` - Hamburger menu button for mobile devices
- `.hamburger-icon` - The three-line icon for the hamburger menu
- `.menu-overlay` - Background overlay that appears when mobile menu is open
- `.active` - State class for active mobile menu elements

## Color Scheme

- Primary Background: Dark (#121212)
- Text: White (#ffffff)
- Accent/Highlight: Yellow (#f6c915)
- Secondary Background: Slightly lighter dark (#1e1e1e)
- Subtle Borders: rgba(255, 255, 255, 0.1)

## Adding New Styles

When adding new styles:

1. Place them in the appropriate section
2. Follow the existing naming conventions
3. Add comments for complex selectors
4. Test responsiveness on multiple screen sizes
5. Maintain the existing color scheme

## Responsive Breakpoints

- Mobile: Up to 767px
- Tablet: 768px to 1023px
- Desktop: 1024px and above

The mobile hamburger menu appears at 768px and below. This breakpoint was chosen to ensure comfortable navigation on tablets and smaller devices.

## Best Practices

- Use the page template in `/templates/page-template.html` for creating new pages
- Use the two-card header layout for all pages (main content card and contact card)
- Use the yellow tagline as the primary text element in the hero section
- Use the existing wide card layout for content sections
- Maintain consistent spacing between elements
- Follow the established color scheme
- Test all changes on mobile, tablet, and desktop views
- Use flexbox for layout when possible
- Keep selectors as simple as possible
- Follow the image naming convention (section-name-image.png)
- Alternate image positions (left/right) for visual interest using the `reverse` class
- Use consistent email addresses (sales@techsoftsys.com for general pages, j.carroll@techsoftsys.com for personal pages)

## Troubleshooting

Common issues and solutions:

- **Inconsistent spacing**: Use the existing margin and padding patterns
- **Mobile layout issues**: Check media queries and test on multiple device sizes
- **Image sizing problems**: Use the ai-image-wrapper class and ensure images are properly sized
- **Text contrast issues**: Ensure text has sufficient contrast against backgrounds

## Interactive Elements

The website includes several interactive elements to enhance user experience:

1. **Mobile Hamburger Menu**
   - Animated hamburger-to-X transformation
   - Slide-in navigation panel
   - Background overlay with fade effect
   - Touch-friendly tap targets
   - Keyboard accessibility (Escape key closes menu)

2. **Button Hover Effects**
   - Scale transformation
   - Color transitions
   - Shadow effects
   - Background gradient animations

3. **Card Hover Effects**
   - Subtle elevation (translateY)
   - Border color changes
   - Background gradient fade-ins

4. **Link Hover Effects**
   - Color transitions
   - Underline animations
   - Scale effects

5. **Contact Link Hover Effects**
   - Color change to yellow (#f6c915)
   - Animated underline that expands from left to right
   - Subtle upward movement (translateY)

## Future Improvements

Potential areas for CSS enhancement:

- Convert to CSS variables for colors and spacing
- Implement a more structured naming system (like BEM)
- Split into multiple files for better organization
- Add print styles for resume and cover letter pages
