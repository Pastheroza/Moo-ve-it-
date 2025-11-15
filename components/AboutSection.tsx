import React from 'react';
import { Card } from './Card';

/**
 * The About Section component.
 * It displays the company's vision and mission statement in a styled card.
 */
export const AboutSection: React.FC = () => {
  return (
    <section>
       <Card className="bg-card-dark">
         <div className="flex flex-col items-center text-center">
            {/* 
              * The layout is a single, centered column to focus on the text content,
              * following the removal of a previously broken image.
            */}
            <div className="max-w-3xl">
                <h2 className="text-3xl md:text-5xl font-extrabold text-text-primary mb-4">Our Vision for the Future of Agriculture</h2>
                <p className="text-text-primary/70 text-lg mb-6">
                    We believe in a future where technology and tradition work hand-in-hand. Our mission is to empower farmers with intelligent, reliable, and easy-to-use tools that increase efficiency, improve animal welfare, and promote sustainable agricultural practices for generations to come.
                </p>
                <button className="bg-text-primary text-base-black font-bold py-3 px-8 rounded-full transition-transform duration-300 hover:-translate-y-1">
                    Learn More About Us
                </button>
            </div>
        </div>
       </Card>
    </section>
  );
};
