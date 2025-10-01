import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, MapPin, Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import GlobeComponent from '../components/3D/Globe';
import { useTravel } from '../contexts/TravelContext';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../calendar.css';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { createItinerary } = useTravel();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [tripData, setTripData] = useState({
    destination: '',
    groupSize: 'Family',
    occasion: 'Anniversary',
    startDate: null as Date | null,
    endDate: null as Date | null,
    budget: '',
  });

  const groupSizeOptions = ['Solo', 'Couple', 'Family', 'Friends', 'Group'];
  const occasionOptions = ['Anniversary', 'Birthday', 'Honeymoon', 'Business', 'Vacation', 'Adventure'];
  const handleStartPlanning = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!tripData.destination.trim()) {
      toast.error('Please enter a destination');
      return;
    }
    
    if (!tripData.startDate || !tripData.endDate) {
      toast.error('Please select start and end dates');
      return;
    }
    
    // Temporarily bypass auth check for testing
    if (!user) {
      console.warn('No user logged in, but proceeding for testing');
      // toast.error('Please log in to create an itinerary');
      // navigate('/');
      // return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Create trip input from form data
      const tripInput = {
        destination: tripData.destination.trim(),
        startDate: tripData.startDate,
        endDate: tripData.endDate,
        travelers: getTravelerCount(tripData.groupSize),
        specialInterests: [tripData.occasion.toLowerCase()],
        constraints: [],
        budget: tripData.budget ? parseInt(tripData.budget) : undefined,
        userId: user?.id || 'test-user' // Fallback for testing
      };
      
      // Create itinerary using the travel context
      await createItinerary(tripInput);
      
      // Navigate to planned trip page
      navigate('/planned-trip');
      
    } catch (error: any) {
      console.error('Error creating itinerary:', error);
      toast.error(error.message || 'Failed to create itinerary. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const getTravelerCount = (groupSize: string): number => {
    switch (groupSize) {
      case 'Solo': return 1;
      case 'Couple': return 2;
      case 'Family': return 4;
      case 'Friends': return 3;
      case 'Group': return 6;
      default: return 2;
    }
  };

  const handleDateClick = (date: Date) => {
    if (!tripData.startDate) {
      // First click - set start date
      setTripData(prev => ({ ...prev, startDate: date }));
    } else if (!tripData.endDate) {
      // Second click - set end date
      if (date < tripData.startDate) {
        // If clicked date is before start date, swap them
        setTripData(prev => ({ 
          ...prev, 
          startDate: date, 
          endDate: prev.startDate 
        }));
      } else {
        // Normal case - set end date
        setTripData(prev => ({ ...prev, endDate: date }));
      }
    } else {
      // Third click - reset and start new selection
      setTripData(prev => ({ 
        ...prev, 
        startDate: date, 
        endDate: null 
      }));
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden home-background" style={{ overflow: 'hidden' }}>
      {/* 3D Globe - Full Screen */}
      <GlobeComponent />

      {/* Trip Planning Glass Card - Positioned on the right side */}
      <motion.div
        className="absolute right-0 top-0 z-20"
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
         <div className="glass-card-main p-8 shadow-2xl flex items-center justify-center relative" style={{height: "100vh", overflow: 'hidden'}}> {/* Added relative positioning */}
           {/* Close button */}
           <button 
             onClick={() => navigate('/dashboard')}
             className="absolute top-4 right-4 p-2 glass-card-floating rounded-full hover:bg-white/10 transition-colors"
             style={{
               position: 'absolute',
               right: '1.5rem',
               top: '1.5rem',
               zIndex: 30
             }}
           >
             <X className="w-5 h-5 text-white" />
           </button>
           
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
                     onClickDay={handleDateClick}
                     value={tripData.startDate && tripData.endDate ? [tripData.startDate, tripData.endDate] : tripData.startDate}
                     selectRange={true}
                     className="react-calendar items-center" 
                     tileClassName="text-white"
                   />
                   {/* Date Selection Status */}
                   <div className="mt-3 text-center">
                     {tripData.startDate && (
                       <p className="text-white/80 text-sm">
                         Start: {tripData.startDate.toLocaleDateString()}
                       </p>
                     )}
                     {tripData.endDate && (
                       <p className="text-white/80 text-sm">
                         End: {tripData.endDate.toLocaleDateString()}
                       </p>
                     )}
                     {!tripData.startDate && (
                       <p className="text-white/60 text-sm">Click to select start date</p>
                     )}
                     {tripData.startDate && !tripData.endDate && (
                       <p className="text-white/60 text-sm">Click to select end date</p>
                     )}
                   </div>
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
                     className="w-full h-10 px-6 glass-card-group text-white focus:outline-none focus:ring-2 rounded-lg text-base"
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
                     className="w-full h-10 px-6 glass-card-occasion text-white focus:outline-none focus:ring-2 rounded-lg text-base"
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
               <div className="text-left mb-10"> {/* Removed pb-4 */}
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
                   disabled={isSubmitting}
                   className="w-full glass-card-button-primary text-white py-3 px-6 rounded-lg font-semibold transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                   style={{height: "45px", width: "100%", color: "#FFFFFF"}}
                 >
                   {isSubmitting ? 'Creating your plan...' : 'Generate my plan'}
                 </button>
                   <button
                     type="button"
                     className="w-full text-white/60 text-sm py-2 px-4 hover:text-white/80 transition-colors"
                     onClick={() => setTripData({
                       destination: '',
                       groupSize: 'Family',
                       occasion: 'Anniversary', 
                       startDate: null,
                       endDate: null,
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