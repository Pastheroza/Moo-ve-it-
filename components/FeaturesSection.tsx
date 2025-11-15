import React from 'react';
import { Card } from './Card';

// An array of feature objects to be displayed in the section.
const features = [
  {
    icon: '🤖',
    title: 'Autonomous Patrolling',
    description: 'Our drone uses advanced pathfinding AI to autonomously patrol your property, ensuring complete coverage without manual intervention.'
  },
  {
    icon: '📈',
    title: 'Real-time Analytics',
    description: 'Access live data on herd location, density, and movement patterns through an intuitive dashboard, available on any device.'
  },
  {
    icon: '❤️',
    title: 'Livestock Health Monitoring',
    description: 'Thermal imaging and behavioral analysis algorithms detect early signs of illness or distress, allowing for prompt intervention.'
  },
  {
    icon: '🛰️',
    title: 'GPS Geofencing',
    description: 'Create virtual boundaries to keep your herd within safe zones. Receive instant alerts if an animal strays.'
  },
  {
    icon: '☀️',
    title: 'All-Weather Operation',
    description: 'Built to withstand harsh environmental conditions, our drone operates reliably in rain, wind, and extreme temperatures.'
  },
  {
    icon: '🔋',
    title: 'Automated Charging',
    description: 'The drone automatically returns to its base station for charging, ensuring it\'s always ready for the next mission.'
  },
];

/**
 * A card component specifically for displaying a single feature.
 * It includes an icon, title, and description.
 */
const FeatureCard: React.FC<{icon: string, title: string, description: string}> = ({icon, title, description}) => (
    <Card className="bg-card-light transition-transform duration-300 hover:-translate-y-2">
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="text-xl font-bold text-text-primary mb-2">{title}</h3>
        <p className="text-text-primary/70">{description}</p>
    </Card>
);

/**
 * The Features Section component.
 * It displays a grid of features that highlight the product's capabilities.
 */
export const FeaturesSection: React.FC = () => {
  return (
    <section>
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-extrabold text-text-primary">Smarter Farming, Simplified.</h2>
        <p className="max-w-2xl mx-auto mt-4 text-lg text-text-primary/70">
            Explore the cutting-edge features that make Shepherd Drone the ultimate herd management solution.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map(feature => (
            <FeatureCard key={feature.title} {...feature} />
        ))}
      </div>
    </section>
  );
};
