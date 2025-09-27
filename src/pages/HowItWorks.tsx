import React from 'react';
import { MapPin, Zap, Users, Star } from 'lucide-react';
import Button from '../components/common/Button';

const HowItWorks: React.FC = () => {
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
    <section className="py-20">
      {/* How It Works */}
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
  );
};

export default HowItWorks;
