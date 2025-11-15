import React from 'react';

/**
 * The main footer component for the application.
 * Contains copyright information and links to legal pages.
 */
export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 py-8 px-4 md:px-6 lg:px-8">
      <div className="text-center text-text-primary/50">
        <p>&copy; {new Date().getFullYear()} Moo-ve It! Inc. All rights reserved.</p>
        <div className="flex justify-center space-x-6 mt-4">
            <a href="#" className="hover:text-text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-text-primary transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
};
