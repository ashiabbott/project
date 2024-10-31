import React from 'react';
import heroImage from '../assets/hero-image.webp';

function HeroSection() {
  return (
    <section className="bg-gray-100 dark:bg-gray-900 py-12">
      <div className="container mx-auto flex flex-col md:flex-row items-center">
        <div className="md:w-1/2">{/* Content */}</div>
        <div className="md:w-1/2 mt-6 md:mt-0">
          <img
            src={heroImage}
            alt="Manage your finances"
            className="w-full h-auto"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
