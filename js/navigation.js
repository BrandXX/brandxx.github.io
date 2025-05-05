// Mobile Navigation Functionality
document.addEventListener('DOMContentLoaded', function() {
  // Select elements
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileMenu = document.querySelector('.links');
  const body = document.body;
  
  // Create overlay element for background when menu is open
  const overlay = document.createElement('div');
  overlay.className = 'menu-overlay';
  body.appendChild(overlay);
  
  // Toggle menu function
  function toggleMenu() {
    menuToggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    overlay.classList.toggle('active');
    
    // Toggle aria-expanded attribute for accessibility
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true' || false;
    menuToggle.setAttribute('aria-expanded', !expanded);
    
    // Prevent body scrolling when menu is open
    if (menuToggle.classList.contains('active')) {
      body.style.overflow = 'hidden';
    } else {
      body.style.overflow = '';
    }
  }
  
  // Event listeners
  menuToggle.addEventListener('click', toggleMenu);
  
  // Close menu when clicking on overlay
  overlay.addEventListener('click', toggleMenu);
  
  // Close menu when clicking a link
  const menuLinks = mobileMenu.querySelectorAll('a');
  menuLinks.forEach(link => {
    link.addEventListener('click', function() {
      if (menuToggle.classList.contains('active')) {
        toggleMenu();
      }
    });
  });
  
  // Close menu on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && menuToggle.classList.contains('active')) {
      toggleMenu();
    }
  });
  
  // Handle window resize
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768 && menuToggle.classList.contains('active')) {
      toggleMenu();
    }
  });
});
