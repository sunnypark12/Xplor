import React from 'react';
import { motion } from 'framer-motion';

interface FriendTrip {
  id: string;
  friendName: string;
  destination: string;
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