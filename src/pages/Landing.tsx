import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Zap, Users, Star } from 'lucide-react';
import Button from '../components/common/Button';

const Landing: React.FC = () => {
  const features = [
    {
      icon: <Zap className="w-8 h-8 text-primary-600" />,
      title: "Real-Time Adaptation",
      description: "Your itinerary automatically adjusts as your trip unfolds. Running late? We'll reschedule everything for you."
    },
    {
      icon: <Users className="w-8 h-8 text-primary-600" />,
      title: "Personalized Planning",
      description: "Every trip is tailored to your travel style, preferences, and interests. No more generic travel guides."
    },
    {
      icon: <MapPin className="w-8 h-8 text-primary-600" />,
      title: "Smart Navigation",
      description: "Integrated location tracking and intelligent routing to maximize your time and minimize stress."
    },
    {
      icon: <Star className="w-8 h-8 text-primary-600" />,
      title: "Gamified Experience",
      description: "Earn badges, complete quests, and discover hidden gems as you explore your destination."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="glass-navbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-glass">Xplor</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="glass-strong p-16 animate-fade-in">
            <h1 className="text-6xl md:text-7xl font-bold text-glass mb-8 leading-tight">
              Your
              <span className="text-primary-600"> Smart </span>
              Travel Companion
            </h1>
            <p className="text-xl md:text-2xl text-glass mb-12 max-w-4xl mx-auto leading-relaxed opacity-90">
              Stop spending hours planning and start exploring. Xplor creates personalized, adaptive itineraries that evolve with your journey in real-time.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/register">
                <Button size="lg" variant="primary">
                  🚀 Start Planning Your Trip
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="glass p-8 rounded-3xl inline-block">
              <h2 className="text-4xl font-bold text-glass mb-4">
                Why Choose Xplor?
              </h2>
              <p className="text-xl text-glass opacity-90 max-w-2xl mx-auto">
                Travel planning shouldn't be overwhelming. We make it seamless, smart, and stress-free.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="glass-card p-8 hover:glass-strong transition-all duration-300 transform hover:-translate-y-2 animate-fade-in"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="mb-6 p-3 glass rounded-2xl w-fit">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-glass mb-4">
                  {feature.title}
                </h3>
                <p className="text-glass opacity-80 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Three simple steps to your perfect trip
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Take Our Quiz
              </h3>
              <p className="text-gray-600">
                Tell us about your travel style, preferences, and interests with our fun personality quiz.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Share Trip Details
              </h3>
              <p className="text-gray-600">
                Provide your destination, dates, and any special requirements or constraints.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Enjoy Your Adventure
              </h3>
              <p className="text-gray-600">
                Get a personalized itinerary that adapts in real-time as you explore and discover.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 gradient-hero"></div>
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="animate-fade-in">
            <h2 className="text-5xl font-bold text-white mb-8">
              Ready to Transform Your Travel Experience?
            </h2>
            <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
              Join thousands of travelers who've discovered the future of trip planning.
            </p>
            <Link to="/register">
              <Button 
                variant="secondary" 
                size="lg" 
                className="bg-white text-primary-600 hover:bg-gray-50 px-12 py-5 text-lg font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1"
              >
                ✨ Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-primary-400 mb-4">Xplor</h3>
            <p className="text-gray-400 mb-6">
              Smart Travel Planning & Itinerary Agent
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
            <p className="text-gray-500 text-sm mt-6">
              © 2024 Xplor. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
