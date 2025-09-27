import React, { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Plus, MapPin } from 'lucide-react';
import Earth from '../components/3D/Earth';
import FriendTripCard from '../components/3D/FriendTripCard';
import TripPlanningSlideBar from '../components/3D/TripPlanningSlideBar';

// Mock data for friend trips
const mockFriendTrips = [
  {
    id: '1',
    friendName: 'Sarah',
    destination: 'San Francisco',
    image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=300&fit=crop',
    duration: '3 days',
    occasion: 'Anniversary',
    position: { x: 25, y: 30, z: 0 }
  },
  {
    id: '2',
    friendName: 'Mike',
    destination: 'Tossa de Mar',
    image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?w=400&h=300&fit=crop',
    duration: '5 days',
    occasion: 'Summer Break',
    position: { x: 70, y: 25, z: 0 }
  },
  {
    id: '3',
    friendName: 'Emma',
    destination: 'Yucatan Peninsula',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
    duration: '7 days',
    occasion: 'Adventure',
    position: { x: 30, y: 60, z: 0 }
  },
  {
    id: '4',
    friendName: 'Alex',
    destination: 'Tokyo',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop',
    duration: '4 days',
    occasion: 'Business',
    position: { x: 80, y: 35, z: 0 }
  }
];

const Home: React.FC = () => {
  const [isSlideBarOpen, setIsSlideBarOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<string | null>(null);

  const handleStartPlanning = (tripData: any) => {
    console.log('Starting trip planning with data:', tripData);
    // Here you would typically navigate to the trip planning page or show a modal
    // For now, we'll just log the data
  };

  const handleTripClick = (tripId: string) => {
    setSelectedTrip(selectedTrip === tripId ? null : tripId);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-gray-900 via-blue-900 to-blue-800">
      {/* Header */}
      <div className="absolute top-0 left-0 z-20 p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-white text-4xl font-bold mb-2">Xplor</h1>
          <p className="text-white/80 text-lg">Discover the world through your friends' adventures</p>
        </motion.div>
      </div>

      {/* 3D Earth Canvas */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 3], fov: 60 }}
          style={{ background: 'transparent' }}
        >
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <pointLight position={[-10, -10, -5]} intensity={0.5} />
          
          <Earth position={[0, 0, 0]} scale={1.2} />
          
          <Environment preset="sunset" />
        </Canvas>
      </div>

      {/* Friend Trip Cards */}
      {mockFriendTrips.map((trip, index) => (
        <motion.div
          key={trip.id}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
        >
          <FriendTripCard
            trip={trip}
            onClick={() => handleTripClick(trip.id)}
          />
        </motion.div>
      ))}

      {/* Trip Planning Button */}
      <motion.button
        className="absolute bottom-6 right-6 z-20 bg-white/20 backdrop-blur-md border border-white/30 rounded-full p-4 hover:bg-white/30 transition-all duration-300 shadow-2xl"
        onClick={() => setIsSlideBarOpen(true)}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="flex items-center gap-3 text-white">
          <Plus className="w-6 h-6" />
          <span className="font-semibold">Plan New Trip</span>
        </div>
      </motion.button>

      {/* Floating Action Button for Map View */}
      <motion.button
        className="absolute bottom-6 left-6 z-20 bg-white/20 backdrop-blur-md border border-white/30 rounded-full p-3 hover:bg-white/30 transition-all duration-300 shadow-2xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <MapPin className="w-6 h-6 text-white" />
      </motion.button>

      {/* Trip Planning Slide Bar */}
      <TripPlanningSlideBar
        isOpen={isSlideBarOpen}
        onClose={() => setIsSlideBarOpen(false)}
        onStartPlanning={handleStartPlanning}
      />

      {/* Selected Trip Overlay */}
      {selectedTrip && (
        <motion.div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm z-30 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedTrip(null)}
        >
          <motion.div
            className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-8 max-w-md mx-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-white mb-4">Trip Details</h3>
            <p className="text-white/80 mb-4">
              This is where you would show detailed information about the selected trip.
            </p>
            <div className="flex gap-3">
              <button
                className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                onClick={() => setSelectedTrip(null)}
              >
                Close
              </button>
              <button
                className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
                onClick={() => {
                  setSelectedTrip(null);
                  setIsSlideBarOpen(true);
                }}
              >
                Plan Similar Trip
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Home;
