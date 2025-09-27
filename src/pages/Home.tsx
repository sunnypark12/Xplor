import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, MapPin, Search } from 'lucide-react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../calendar.css';
import GlobeComponent from '../components/3D/Globe';

const Home: React.FC = () => {
  const [tripData, setTripData] = useState({
    destination: '',
    groupSize: 'Family',
    occasion: 'Anniversary',
    selectedDates: new Date(),
  });

  const groupSizeOptions = ['Solo', 'Couple', 'Family', 'Friends', 'Group'];
  const occasionOptions = ['Anniversary', 'Birthday', 'Honeymoon', 'Business', 'Vacation', 'Adventure'];

  const handleStartPlanning = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Starting trip planning with data:', tripData);
  };

  return (
    <div className="relative w-40% h-screen overflow-hidden">
      {/* 3D Globe - Full Screen */}
      <GlobeComponent />

      {/* Trip Planning Glass Card - Positioned on the right side */}
      <motion.div
        className="items-end justify-end transform -translate-y-1/2 z-20 w-96"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        style={{ 
            width: "40%", 
            height: "100%", 
            fontSize: "1rem", 
            marginLeft: "850px",
            marginTop: "15px",
          }}
      >
         <div className="glass-card p-4 shadow-2xl">
           <div className="text-white">
             {/* Header */}
             <div className="flex items-center gap-2 mb-4">
               <h2 className="text-lg font-bold play-regular" style={{ 
                        color: "#f1f1f1", 
                        height: "10%", 
                        fontSize: "2rem", 
                        padding: "0.75rem",
                        marginLeft: "15px",
                    }}>Your Next Adventure...</h2>
             </div>

             {/* Form */}
             <form onSubmit={handleStartPlanning} className="space-y-3">
               {/* Destination */}
               <div>
                 <label className="play-regular text-white font-medium mb-1 block"> Destination</label>
                 <div className="relative">
                   <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
                   <input
                    style={{ 
                        width: "50%", 
                        height: "10%", 
                        fontSize: "1rem", 
                        padding: "0.75rem",
                        marginTop: "15px",
                    }}
                     type="text"
                     placeholder="Where are you heading?"
                     className="w-full pl-8 pr-3 py-2 glass-card text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-sm"
                     value={tripData.destination}
                     onChange={(e) => setTripData(prev => ({ ...prev, destination: e.target.value }))}
                   />
                 </div>
               </div>

               {/* Calendar */}
               <div>
                 <label className="play-regular font-medium mb-1 block text-sm" style={{ 
                        color: "#f1f1f1", 
                        fontSize: "1rem", 
                        padding: "0.75rem",
                    }}>Dates</label>
                 <div className="glass-card p-2 rounded-lg" style={{ 
                        width: "80%", 
                        fontSize: "1rem", 
                    }}>
                   <Calendar
                     onChange={(date) => setTripData(prev => ({ ...prev, selectedDates: date as Date }))}
                     value={tripData.selectedDates}
                     className="react-calendar items-center" 
                     tileClassName="text-white"
                   />
                 </div>
               </div>

               {/* Group Size & Occasion */}
               <div className="grid grid-cols-2 gap-2">
                 <div>
                   <label className="text-white font-medium mb-1 block text-sm">Group Size</label>
                   <select
                     className="w-full px-2 py-2 glass-card text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-sm"
                     value={tripData.groupSize}
                     onChange={(e) => setTripData(prev => ({ ...prev, groupSize: e.target.value }))}
                   >
                     {groupSizeOptions.map(option => (
                       <option key={option} value={option} className="bg-gray-800">
                         {option}
                       </option>
                     ))}
                   </select>
                 </div>
                 
                 <div>
                   <label className="text-white font-medium mb-1 block text-sm">Occasion</label>
                   <select
                     className="w-full px-2 py-2 glass-card text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-sm"
                     value={tripData.occasion}
                     onChange={(e) => setTripData(prev => ({ ...prev, occasion: e.target.value }))}
                   >
                     {occasionOptions.map(option => (
                       <option key={option} value={option} className="bg-gray-800">
                         {option}
                       </option>
                     ))}
                   </select>
                 </div>
               </div>

               {/* Action Buttons */}
               <div className="space-y-2">
                 <button
                   type="submit"
                   className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors text-sm"
                 >
                   Generate my plan
                 </button>
                 
                 <button
                   type="button"
                   className="w-full text-white/60 hover:text-white transition-colors text-xs"
                   onClick={() => setTripData({
                     destination: '',
                     groupSize: 'Family',
                     occasion: 'Anniversary',
                     selectedDates: new Date(),
                   })}
                 >
                   reset
                 </button>
               </div>
            </form>
          </div>
        </div>
      </motion.div>

      {/* Floating Action Button for Map View - Positioned in bottom right */}
      <motion.button
        className="absolute bottom-6 right-6 z-20 bg-white/80 backdrop-blur-md border border-gray-200 rounded-full p-3 hover:bg-white/90 transition-all duration-300 shadow-2xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <MapPin className="w-6 h-6 text-gray-700" />
      </motion.button>

    </div>
  );
};

export default Home;