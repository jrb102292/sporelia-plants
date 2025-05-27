'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const HomePageWrapper: React.FC = () => {
  const router = useRouter();

  const handleEnterGarden = () => {
    router.push('/dashboard');
  };

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Hero Section */}
      <section className="min-h-[calc(60vh-80px)] flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16 py-8">
        <div className="lg:w-1/2 text-center lg:text-left">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold font-display text-canopy-green leading-tight mb-6">
            Welcome to <span className="text-sage-mist">Sporelia</span>
          </h1>
          <p className="text-lg sm:text-xl font-body text-text-muted leading-airy mb-8 max-w-xl mx-auto lg:mx-0">
            Your personal sanctuary to nurture, track, and understand your beloved plants. Transform your plant care from a chore into a delightful journey of growth.
          </p>
          <button
            type="button"
            onClick={handleEnterGarden}
            className="inline-block bg-canopy-green hover:bg-opacity-90 text-cream-pulp font-medium py-3.5 px-8 rounded-button shadow-sm hover:shadow-interactive transition-all duration-200 ease-out text-base uppercase tracking-wider focus:outline-none focus-style"
          >
            Enter Your Garden
            <i className="fas fa-arrow-right ml-2"></i>
          </button>
        </div>
        <div className="lg:w-1/2 mt-8 lg:mt-0">
          {/* Beautiful plant macro photo */}
          <div 
            className="w-full aspect-square sm:aspect-video lg:aspect-square rounded-card shadow-soft overflow-hidden border border-lichen-veil/30 relative group"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80')",
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 bg-canopy-green bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300 ease-out"></div>
          </div>
        </div>
      </section>

      {/* Feature Showcase */}
      <section className="grid md:grid-cols-3 gap-8 lg:gap-12">
        <div className="text-center">
          <div className="w-16 h-16 bg-sage-mist rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fas fa-seedling text-2xl text-cream-pulp"></i>
          </div>
          <h3 className="text-xl font-bold font-heading text-canopy-green mb-4">Track Growth</h3>
          <p className="text-text-muted font-body leading-airy">
            Monitor your plants' progress with detailed growth logs, photos, and care schedules tailored to each species.
          </p>
        </div>
        <div className="text-center">
          <div className="w-16 h-16 bg-sage-mist rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fas fa-brain text-2xl text-cream-pulp"></i>
          </div>
          <h3 className="text-xl font-bold font-heading text-canopy-green mb-4">Smart Care</h3>
          <p className="text-text-muted font-body leading-airy">
            Get personalized care recommendations powered by AI insights and proven botanical knowledge.
          </p>
        </div>
        <div className="text-center">
          <div className="w-16 h-16 bg-sage-mist rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fas fa-heart text-2xl text-cream-pulp"></i>
          </div>
          <h3 className="text-xl font-bold font-heading text-canopy-green mb-4">Nurture Bond</h3>
          <p className="text-text-muted font-body leading-airy">
            Build deeper connections with your green companions through mindful observation and loving care.
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomePageWrapper;
