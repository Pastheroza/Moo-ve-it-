import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * A reusable Card component with consistent styling.
 * It serves as a styled container for other content blocks.
 * @param children - The content to be rendered inside the card.
 * @param className - Optional additional CSS classes to apply to the card.
 */
export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-card-dark rounded-3xl p-6 md:p-8 ${className}`}>
      {children}
    </div>
  );
};
