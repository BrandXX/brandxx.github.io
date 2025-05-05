# JavaScript Documentation

This folder contains JavaScript files for the TechSoft Systems website. Currently, the site uses minimal JavaScript, focusing primarily on analytics tracking.

## File Structure

- `analytics.js` - Google Analytics 4 implementation
- `navigation.js` - Mobile navigation functionality

## JavaScript Components

### Mobile Navigation

The `navigation.js` file handles the mobile hamburger menu functionality. This script:

- Toggles the mobile menu when the hamburger icon is clicked
- Creates and manages the overlay background
- Handles closing the menu when links are clicked
- Provides keyboard accessibility (Escape key closes the menu)
- Responds to window resize events
- Prevents body scrolling when the menu is open

### Implementation Details

The navigation script is included at the bottom of each HTML page:

```html
<!-- Navigation Script -->
<script src="js/navigation.js"></script>
```

The script works in conjunction with CSS classes to toggle visibility and animations:
- `.mobile-menu-toggle` - The hamburger button
- `.hamburger-icon` - The three-line icon that transforms to an X
- `.links` - The navigation links container
- `.active` - Applied to elements when the menu is open
- `.menu-overlay` - The semi-transparent background overlay

### Google Analytics 4

The `analytics.js` file contains the Google Analytics 4 (GA4) implementation for tracking website usage. This script:

- Initializes the Google Analytics data layer
- Configures the GA4 property with Measurement ID: G-358YBL56YW
- Tracks page views automatically
- Works in conjunction with the gtag.js script loaded in the HTML head

The analytics script is included in each HTML page via:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-358YBL56YW"></script>
<script src="js/analytics.js"></script>
```

## Future JavaScript Enhancements

As the website grows, additional JavaScript functionality could be added:

### Potential Additions

1. **Form Validation**
   - Client-side validation for the contact form
   - Real-time feedback for users
   - Form submission handling

2. **Interactive Elements**
   - Smooth scrolling to page sections
   - Animated content reveals on scroll
   - Interactive service toggles or accordions

3. **Navigation Enhancements**
   - Sticky header on scroll
   - Active link highlighting
   - Dropdown submenus (if needed in the future)

4. **Performance Optimizations**
   - Lazy loading for images
   - Deferred loading of non-critical scripts
   - Resource prefetching

5. **User Experience Improvements**
   - Dark/light mode toggle
   - Font size adjustments
   - Accessibility enhancements

## Best Practices

When adding new JavaScript:

1. **Organization**
   - Create separate files for distinct functionality
   - Use descriptive file names
   - Add comments for complex logic

2. **Performance**
   - Minimize DOM manipulations
   - Use event delegation where appropriate
   - Defer non-critical scripts

3. **Compatibility**
   - Test across multiple browsers
   - Consider polyfills for older browsers if needed
   - Use feature detection rather than browser detection

4. **Maintainability**
   - Follow consistent coding style
   - Use meaningful variable and function names
   - Document functions with JSDoc comments

## Implementation Guidelines

When implementing new JavaScript features:

1. Create a new .js file for the specific functionality
2. Add appropriate comments and documentation
3. Include the script in HTML pages where needed
4. Test thoroughly on multiple devices and browsers
5. Update this README with details about the new functionality

## Analytics Configuration

To modify the Google Analytics configuration:

1. Update the Measurement ID in `analytics.js`
2. Update the corresponding script tag in the HTML files
3. Verify the changes in the Google Analytics dashboard

## Troubleshooting

Common issues and solutions:

- **Analytics not tracking**: Verify that both the gtag.js script and analytics.js are properly included in all HTML pages
- **Console errors**: Check for JavaScript syntax errors or conflicts with other scripts
- **Performance issues**: Consider using async or defer attributes for script loading
- **Mobile menu not working**: Ensure navigation.js is properly included at the bottom of all HTML pages
- **Menu not closing**: Check that event listeners are properly attached to menu links and overlay
- **Menu appearing on desktop**: Verify CSS media queries are correctly targeting mobile screen sizes (≤768px)
