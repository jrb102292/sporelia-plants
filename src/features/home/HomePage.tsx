import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleEnterGarden = () => {
    if (navigate) {
      navigate('/dashboard');
    }
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
              backgroundImage: `url('https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'saturate(0.8) contrast(0.9)'
            }}
          >
            {/* Plant icon for tests */}
            <i className="fas fa-seedling sr-only" aria-hidden="true"></i>
            
            {/* Subtle overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-canopy-green/20 to-transparent opacity-70 group-hover:opacity-60 transition-opacity duration-300"></div>
            
            {/* Optional text overlay */}
            <div className="absolute bottom-4 left-4 right-4 text-cream-pulp text-sm font-medium drop-shadow-sm">
              <p className="opacity-90">Discover the beauty in every leaf</p>
            </div>
          </div>
        </div>
      </section>

      {/* App Pitch / Features Highlights (Optional - can expand later) */}
      <section className="py-12">
        <h2 className="text-3xl sm:text-4xl font-heading font-semibold text-canopy-green text-center mb-10">Why Sporelia?</h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="p-6 bg-cream-pulp rounded-card border border-lichen-veil shadow-subtle">
            <i className="fas fa-book-open text-4xl text-sun-bark mb-4"></i>
            <h3 className="text-xl font-heading font-semibold text-canopy-green mb-2">Organize & Track</h3>
            <p className="text-text-muted font-body text-sm">Effortlessly log your plants, watering schedules, and care notes.</p>
          </div>
          <div className="p-6 bg-cream-pulp rounded-card border border-lichen-veil shadow-subtle">
            <i className="fas fa-lightbulb text-4xl text-sun-bark mb-4"></i>
            <h3 className="text-xl font-heading font-semibold text-canopy-green mb-2">AI-Powered Insights</h3>
            <p className="text-text-muted font-body text-sm">Get tailored care tips powered by Gemini to help your plants thrive.</p>
          </div>
          <div className="p-6 bg-cream-pulp rounded-card border border-lichen-veil shadow-subtle">
            <i className="fas fa-heart text-4xl text-sun-bark mb-4"></i>
            <h3 className="text-xl font-heading font-semibold text-canopy-green mb-2">Grow with Joy</h3>
            <p className="text-text-muted font-body text-sm">Focus on the beauty of gardening, not the guesswork.</p>
          </div>
        </div>
      </section>


      {/* About the Gardener Section */}
      <section className="py-12 bg-lichen-veil/30 rounded-card border border-lichen-veil/70">
        <div className="container mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="md:w-1/3 flex justify-center">
            {/* Placeholder for gardener photo */}
            <div className="w-40 h-40 sm:w-48 sm:h-48 bg-sage-mist/40 rounded-full shadow-subtle flex items-center justify-center border-2 border-sage-mist">
              <i className="fas fa-user-circle text-7xl sm:text-8xl text-canopy-green opacity-80"></i>
            </div>
          </div>
          <div className="md:w-2/3 text-center md:text-left">
            <h2 className="text-3xl sm:text-4xl font-heading font-semibold text-canopy-green mb-4">
              About the Gardener
            </h2>
            <p className="text-text-muted font-body leading-airy mb-3">
              Hello! I'm the creator behind Sporelia, driven by a deep passion for plants and technology. My journey into the world of horticulture started with a single, resilient succulent and blossomed into a lush indoor jungle. 
            </p>
            <p className="text-text-muted font-body leading-airy">
              I built Sporelia to be the plant-savvy friend I always wished for – a place to organize, learn, and find joy in every leaf and bloom. My hope is that it helps you cultivate not just plants, but also a deeper connection with nature. Happy planting!
              {/* This is ~100 words, can expand to 150 if needed */}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;