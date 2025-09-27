import React from 'react';
import { motion } from 'framer-motion';

interface FriendTrip {
  id: string;
  friendName: string;
  destination: string;
  image: string;
  duration: string;
  occasion: string;
  position: { x: number; y: number; z: number };
}

interface FriendTripCardProps {
  trip: FriendTrip;
  onClick?: () => void;
}

const FriendTripCard: React.FC<FriendTripCardProps> = ({ trip, onClick }) => {
  return (
    <motion.div
      className="absolute z-10"
      style={{
        left: `${trip.position.x}%`,
        top: `${trip.position.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
      onClick={onClick}
    >
      <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 w-64 border border-white/30 shadow-2xl cursor-pointer hover:bg-white/30 transition-all duration-300">
        <div className="relative">
          <img
            src={trip.image}
            alt={trip.destination}
            className="w-full h-32 object-cover rounded-xl mb-3"
          />
          <div className="absolute top-2 right-2 bg-white/20 backdrop-blur-sm rounded-full p-1">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        
        <div className="text-white">
          <h3 className="font-bold text-lg mb-1">{trip.destination}</h3>
          <p className="text-white/80 text-sm mb-2">by {trip.friendName}</p>
          
          <div className="flex items-center justify-between text-sm">
            <span className="bg-green-500/20 text-green-200 px-2 py-1 rounded-full">
              {trip.duration}
            </span>
            <span className="text-white/70">{trip.occasion}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FriendTripCard;