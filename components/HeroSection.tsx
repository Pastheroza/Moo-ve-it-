import React from 'react';

/**
 * The Hero Section component.
 * This is the main banner at the top of the page, featuring a background image,
 * a headline, a descriptive paragraph, and a call-to-action button.
 */
export const HeroSection: React.FC = () => {
  return (
    <section className="relative rounded-3xl overflow-hidden">
      {/* Background Image with blur effect */}
      <img 
        src="https://images.unsplash.com/photo-1560493676-04071c5f467b?q=80&w=1974&auto=format&fit=crop" 
        alt="Aerial view of a farm"
        className="absolute inset-0 w-full h-full object-cover filter blur-sm scale-105"
      />
      {/* Content Overlay */}
      <div className="relative bg-black/40 text-center py-24 md:py-48 px-4">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-text-primary leading-tight mb-6">
          Automated Cattle Herding,
          <br />
          Managed with Precision and Care.
        </h1>
        <p className="max-w-3xl mx-auto text-lg md:text-xl text-text-primary/80 mb-10">
          We provide autonomous drone solutions for seamless herd monitoring and management for farms of all sizes.
        </p>
        <div className="flex justify-center">
          <button className="bg-text-primary text-base-black font-bold py-4 px-10 rounded-full transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-white/20">
            Request a Demo
          </button>
        </div>
      </div>
    </section>
  );
};
