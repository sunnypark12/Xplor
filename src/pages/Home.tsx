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
    budget: '',
  });

  const groupSizeOptions = ['Solo', 'Couple', 'Family', 'Friends', 'Group'];
  const occasionOptions = ['Anniversary', 'Birthday', 'Honeymoon', 'Business', 'Vacation', 'Adventure'];
  const handleStartPlanning = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Starting trip planning with data:', tripData);
  };

  return (
    <div className="relative w-40% h-screen overflow-hidden home-background" style={{ overflow: 'hidden' }}>
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
            marginLeft: "870px",
            overflow: 'hidden'
          }}
      >
         <div className="glass-card-main p-8 shadow-2xl flex items-center justify-center" style={{height: "100vh", overflow: 'hidden'}}> {/* Increased padding */}
           <div className="text-white w-full max-w-md mx-auto">
             {/* Header */}
             <div className="flex items-start justify-start gap-2 mb-8"> {/* Increased margin bottom */}
               <h2 className="text-lg font-regular play-regular text-white" style={{ 
                        color: "#FFFFFF", 
                        fontSize: "2rem", 
                        padding: "0.75rem",
                    }}>Your Next Adventure...</h2>
             </div>

             {/* Form */}
             <form onSubmit={handleStartPlanning} className="space-y-8"> {/* Slightly increased space between form elements */}
               {/* Destination */}
               <div className="text-left mb-7"> {/* Slightly increased margin bottom */}
                 <label className="play-regular text-white font-medium mb-3 block pl-3" style={{color: "#FFFFFF"}}> Destination</label>
                   <div className="relative">
                     <div className="glass-card-input flex items-center px-3" style={{height: "45px", paddingLeft: "20px"}}>
                       <Search className="w-4 h-4 text-white/20 mr-2" style={{marginRight: "12px"}} />
                        <input
                          type="text"
                          placeholder="Where are you heading?"
                          className="w-full bg-transparent text-white placeholder-white/80 text-sm"
                          value={tripData.destination}
                          onChange={(e) => setTripData(prev => ({ ...prev, destination: e.target.value }))}
                          style={{
                            WebkitTextFillColor: "white", 
                            caretColor: "white",
                            WebkitUserSelect: "none",
                            WebkitBackgroundClip: "transparent",
                            background: "transparent",
                            border: "none",
                            outline: "none",
                            boxShadow: "none"
                          }}
                        />
                     </div>
                   </div>
               </div>

               {/* Calendar */}
               <div className="text-left mb-7"> {/* Slightly increased margin bottom */}
                 <label className="play-regular font-medium mb-3 block text-sm text-white" style={{ 
                        color: "#f1f1f1", 
                        fontSize: "1rem", 
                    }}>Dates</label>
                 <div className="glass-card-calendar p-3 rounded-lg mx-auto" style={{ 
                        width: "100%", 
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
               <div className="flex justify-between gap-8 mb-7"> {/* Slightly increased margin bottom */}
                 {/* Left Column - Group Size */}
                 <div className="w-[45%] flex flex-col">
                   <div className="text-left mb-4">
                     <label className="play-regular text-white font-medium text-base" style={{color: "#FFFFFF"}}>
                       Group Size
                     </label>
                   </div>
                   <select
                     className="w-full h-12 px-6 glass-card-group text-white focus:outline-none focus:ring-2 rounded-lg text-base"
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

                 {/* Right Column - Occasion */}
                 <div className="w-[55%] flex flex-col">
                   <div className="text-left mb-4">
                     <label className="play-regular text-white font-medium text-base" style={{color: "#FFFFFF"}}>
                       Occasion
                     </label>
                   </div>
                   <select
                     className="w-full h-12 px-6 glass-card-occasion text-white focus:outline-none focus:ring-2 rounded-lg text-base"
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

               {/* Budget */}
               <div className="text-left mb-18 pb-4"> {/* Increased margin bottom for more space */}
                 <label className="play-regular text-white font-medium mb-4 block text-base" style={{color: "#FFFFFF"}}>Budget</label>
                 <div className="relative">
                 <div className="glass-card-input flex items-center px-3" style={{height: "45px", paddingLeft: "20px"}}>
                   <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 text-sm" style={{marginRight: "12px"}}>$</span>
                   <input
                     type="number"
                     placeholder="Enter your budget"
                     className="w-full text-white placeholder-white/60 rounded-lg text-sm"
                     value={tripData.budget}
                     onChange={(e) => setTripData(prev => ({ ...prev, budget: e.target.value }))}
                     style={{
                       border: "none",
                       outline: "none",
                       boxShadow: "none",
                       WebkitTextFillColor: "white",
                       caretColor: "white",
                       WebkitUserSelect: "none",
                       background: "transparent"
                     }}
                   />
                   </div>
                 </div>
               </div>

               {/* Action Buttons */}
               <div className="space-y-5 text-center mt-10"> {/* Increased margin top and space between buttons */}
                 <button
                   type="submit"
                   className="w-full glass-card-button-primary text-white py-3 px-6 rounded-lg font-semibold transition-colors text-sm"
                   style={{height: "45px", width: "100%", color: "#FFFFFF"}}
                 >
                   Generate my plan
                 </button>
                   <button
                     type="button"
                     className="w-full text-white/60 text-sm py-2 px-4 hover:text-white/80 transition-colors"
                     onClick={() => setTripData({
                       destination: '',
                       groupSize: 'Family',
                       occasion: 'Anniversary', 
                       selectedDates: new Date(),
                       budget: '',
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
        className="absolute bottom-6 right-6 z-20 glass-card-floating p-3 transition-all duration-300"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <MapPin className="w-6 h-6 text-white" />
      </motion.button>

    </div>
  );
};

export default Home;