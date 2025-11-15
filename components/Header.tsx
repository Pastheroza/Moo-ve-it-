import React from 'react';

/**
 * The main header component for the application.
 * It is sticky, has a glassmorphism effect (transparent with blur),
 * and contains the site title and navigation links.
 */
export const Header: React.FC = () => {
  // Converted navItems to an array of objects to include href for scrolling
  const navItems = [
    { name: 'Live Map', href: '#live-map' },
    { name: 'Features', href: '#features' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  /**
   * Handles the click event for navigation links.
   * It prevents the default anchor behavior and smoothly scrolls to the target section.
   * @param event - The mouse click event.
   * @param targetId - The ID of the element to scroll to (e.g., '#features').
   */
  const handleNavClick = (event: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    // Prevent the default browser action of jumping to the anchor,
    // which was causing a full page reload and breaking the SPA.
    event.preventDefault();
    
    // Find the target element using the provided ID.
    const targetElement = document.querySelector(targetId);
    
    // If the element exists, smoothly scroll to it.
    // The browser's `scrollIntoView` API respects the `scroll-margin-top`
    // CSS property, which prevents the sticky header from hiding the section title.
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };


  return (
    <header className="sticky top-0 z-50 py-4 px-4 md:px-6 lg:px-8 bg-base-black/70 backdrop-blur-lg">
      <div className="flex justify-between items-center">
        <div className="text-2xl font-extrabold text-text-primary">
          Moo-ve It!
        </div>
        {/* Navigation for medium screens and up */}
        <nav className="hidden md:flex space-x-8">
          {navItems.map(item => (
            <a 
              key={item.name} 
              href={item.href} 
              onClick={(e) => handleNavClick(e, item.href)}
              className="text-text-primary/70 hover:text-text-primary transition-colors duration-300 cursor-pointer"
            >
              {item.name}
            </a>
          ))}
        </nav>
        {/* Mobile menu button */}
        <button className="md:hidden text-text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>
    </header>
  );
};