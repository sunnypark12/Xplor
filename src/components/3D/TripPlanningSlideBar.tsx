import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Users, Plane, X } from 'lucide-react';

interface TripPlanningSlideBarProps {
  isOpen: boolean;
  onClose: () => void;
  onStartPlanning: (tripData: any) => void;
}

const TripPlanningSlideBar: React.FC<TripPlanningSlideBarProps> = ({
  isOpen,
  onClose,
  onStartPlanning,
}) => {
  const [tripData, setTripData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    travelers: 1,
    budget: '',
    interests: [] as string[],
  });

  const interestOptions = [
    'Adventure', 'Culture', 'Food', 'Nature', 'History', 'Beach', 'City', 'Mountains'
  ];

  const handleInterestToggle = (interest: string) => {
    setTripData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartPlanning(tripData);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Slide Bar */}
          <motion.div
            className="fixed right-0 top-0 h-full w-96 bg-gray-900/95 backdrop-blur-xl border-l border-white/20 z-50 overflow-y-auto"
            initial={{ x: 384 }}
            animate={{ x: 0 }}
            exit={{ x: 384 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Plan Your Trip</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Destination */}
                <div>
                  <label className="flex items-center gap-2 text-white font-medium mb-2">
                    <MapPin className="w-5 h-5" />
                    Destination
                  </label>
                  <input
                    type="text"
                    placeholder="Where do you want to go?"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={tripData.destination}
                    onChange={(e) => setTripData(prev => ({ ...prev, destination: e.target.value }))}
                  />
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-white font-medium mb-2">
                      <Calendar className="w-5 h-5" />
                      Start Date
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={tripData.startDate}
                      onChange={(e) => setTripData(prev => ({ ...prev, startDate: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-white font-medium mb-2">
                      <Calendar className="w-5 h-5" />
                      End Date
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={tripData.endDate}
                      onChange={(e) => setTripData(prev => ({ ...prev, endDate: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Travelers */}
                <div>
                  <label className="flex items-center gap-2 text-white font-medium mb-2">
                    <Users className="w-5 h-5" />
                    Number of Travelers
                  </label>
                  <div className="flex items-center bg-white/10 border border-white/20 rounded-lg p-2">
                    <button
                      type="button"
                      onClick={() => setTripData(prev => ({ 
                        ...prev, 
                        travelers: Math.max(1, prev.travelers - 1) 
                      }))}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <span className="text-white text-xl">-</span>
                    </button>
                    <span className="flex-1 text-center text-white font-semibold text-lg">
                      {tripData.travelers}
                    </span>
                    <button
                      type="button"
                      onClick={() => setTripData(prev => ({ 
                        ...prev, 
                        travelers: prev.travelers + 1 
                      }))}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <span className="text-white text-xl">+</span>
                    </button>
                  </div>
                </div>

                {/* Budget */}
                <div>
                  <label className="flex items-center gap-2 text-white font-medium mb-2">
                    <Plane className="w-5 h-5" />
                    Budget (USD)
                  </label>
                  <input
                    type="number"
                    placeholder="Enter your budget"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={tripData.budget}
                    onChange={(e) => setTripData(prev => ({ ...prev, budget: e.target.value }))}
                  />
                </div>

                {/* Interests */}
                <div>
                  <h3 className="text-white font-semibold mb-3">What interests you?</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {interestOptions.map((interest) => (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => handleInterestToggle(interest)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          tripData.interests.includes(interest)
                            ? 'bg-blue-500 text-white'
                            : 'bg-white/10 text-white/80 hover:bg-white/20'
                        }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                >
                  Start Planning
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TripPlanningSlideBar;