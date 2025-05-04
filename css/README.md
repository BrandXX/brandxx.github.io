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
- Mobile navigation
- Active state styling
- Responsive adjustments

### 4. Typography
- Headings (h1-h6)
- Paragraph styles
- Link styling
- Font weights and sizes

### 5. Hero Section
- Hero background and animations
- Hero content positioning
- Tagline styling
- Call-to-action elements

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
- `.ai-flex-container` - Flexbox container for content and images
- `.ai-text-content` - Text content within flex containers
- `.ai-image-wrapper` - Image wrapper within flex containers
- `.ai-section-title` - Section headings
- `.reverse` - Modifier class to reverse flex direction

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

## Best Practices

- Use the existing wide card layout for new sections
- Maintain consistent spacing between elements
- Follow the established color scheme
- Test all changes on mobile, tablet, and desktop views
- Use flexbox for layout when possible
- Keep selectors as simple as possible
- Follow the image naming convention (section-name-image.png)
- Alternate image positions (left/right) for visual interest using the `reverse` class

## Troubleshooting

Common issues and solutions:

- **Inconsistent spacing**: Use the existing margin and padding patterns
- **Mobile layout issues**: Check media queries and test on multiple device sizes
- **Image sizing problems**: Use the ai-image-wrapper class and ensure images are properly sized
- **Text contrast issues**: Ensure text has sufficient contrast against backgrounds

## Future Improvements

Potential areas for CSS enhancement:

- Convert to CSS variables for colors and spacing
- Implement a more structured naming system (like BEM)
- Split into multiple files for better organization
- Add print styles for resume and cover letter pages
