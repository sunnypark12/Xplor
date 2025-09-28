import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTravel } from '../contexts/TravelContext';
import profileBg from '../profilebg.png';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { travelProfile } = useTravel();
  const [activeTab, setActiveTab] = useState('past');

  // Function to calculate user statistics
  const getUserStatistics = () => {
    // Mock data - in a real app, this would come from the user's data
    const savedTrips = 32;
    const countriesVisited = 10;
    const questsCompleted = 16;
    
    return {
      savedTrips,
      countriesVisited,
      questsCompleted
    };
  };

  const stats = getUserStatistics();

  // Override body background when component mounts
  useEffect(() => {
    const originalBackground = document.body.style.backgroundImage;
    const originalBackgroundColor = document.body.style.backgroundColor;
    
    document.body.style.backgroundImage = `url(${profileBg})`;
    document.body.style.backgroundColor = 'transparent';
    
    // Cleanup: restore original background when component unmounts
    return () => {
      document.body.style.backgroundImage = originalBackground;
      document.body.style.backgroundColor = originalBackgroundColor;
    };
  }, []);

  // Mock data for past travel plans
  const pastTravelPlans = [
    {
      id: 1,
      destination: 'Tokyo, Japan',
      dates: 'SEPT 26 - 29',
      type: 'SOLO TRIP',
      occasion: 'NO SPECIFIC OCCASION',
      itinerary: [
        { day: 'Day One', time: '11:00', activity: 'flight to ICN' },
        { day: 'Day One', time: '02:00pm', activity: 'Late lunch at KIMBAP HEAVEN' },
        { day: 'Day One', time: '10:00pm', activity: 'END' },
        { day: 'Day Two', time: '', activity: '' },
        { day: 'Day Three', time: '', activity: '' }
      ]
    },
    {
      id: 2,
      destination: 'Seoul, Korea',
      dates: 'SEPT 26 - 29',
      type: 'SOLO TRIP',
      occasion: 'NO SPECIFIC OCCASION',
      itinerary: []
    },
    {
      id: 3,
      destination: 'Hanoi, Vietnam',
      dates: 'SEPT 26 - 29',
      type: 'SOLO TRIP',
      occasion: 'NO SPECIFIC OCCASION',
      itinerary: []
    },
    {
      id: 4,
      destination: 'Paris, France',
      dates: 'SEPT 26 - 29',
      type: 'FAMILY TRIP',
      occasion: 'Anniversary',
      itinerary: []
    }
  ];

  // Mock data for liked travel plans
  const likedTravelPlans = [
    {
      id: 5,
      destination: 'Barcelona, Spain',
      dates: 'OCT 15 - 18',
      type: 'COUPLE TRIP',
      occasion: 'HONEYMOON',
      itinerary: [
        { day: 'Day One', time: '09:00', activity: 'Arrive at BCN' },
        { day: 'Day One', time: '12:00pm', activity: 'Lunch at La Boqueria' },
        { day: 'Day One', time: '03:00pm', activity: 'Sagrada Familia tour' }
      ]
    },
    {
      id: 6,
      destination: 'Amsterdam, Netherlands',
      dates: 'NOV 10 - 13',
      type: 'FRIENDS TRIP',
      occasion: 'BIRTHDAY CELEBRATION',
      itinerary: []
    },
    {
      id: 7,
      destination: 'Bangkok, Thailand',
      dates: 'DEC 5 - 12',
      type: 'SOLO TRIP',
      occasion: 'VACATION',
      itinerary: []
    }
  ];

  // Get current travel plans based on active tab
  const currentTravelPlans = activeTab === 'past' ? pastTravelPlans : likedTravelPlans;

  return (
    <div 
      className="relative min-h-screen flex flex-col"
      style={{
        backgroundImage: `url(${profileBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
        width: '100%'
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Top bar - reused from Landing page */}
      <div className="relative z-10 w-full px-10 py-10 flex justify-between items-center text-white">
        <h1 className="text-3xl font-bold play-regular" style={{ fontSize: "1.5rem", marginLeft: "20px", marginTop: "10px", color: "#1B5A67" }}>Xplor</h1>
        <div className="flex items-center gap-4">
          <Link
            to="/how-it-works"
            className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition flex items-center justify-center"
            title="How it works"
            style={{ marginRight: "10px" }}
          >
            <img 
              src="./src/question.png" 
              alt="How it works" 
              className="w-6 h-6"
            />
          </Link>
          <Link
            to="/profile"
            className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition flex items-center justify-center"
            title="Profile"
            style={{ marginRight: "20px" }}
          >
            <img 
              src="./src/profile.png" 
              alt="Profile" 
              className="w-6 h-6"
            />
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-1 px-20 gap-16" style={{ marginTop: '20px', marginLeft: "100px" }}>
        {/* Left Panel - User Info, Quest, Stats */}
        <div className="w-2/5 space-y-6">
          {/* Profile Header */}
          <div className="text-white">
            <h1 className="play-regular mb-4" style={{ fontSize: "4rem", marginTop: "8px" }}>Hello,</h1>
            <h1 className="play-regular mb-4" style={{ fontSize: "4rem", marginTop: "-40px" }}>{user?.displayName || 'Yeoram Seo'}!</h1>
          </div>

          {/* User Persona */}
          <div className="text-white">
            <p className="play-regular text-sm mb-2" style={{ color: "#f1f1f1", fontSize: "1rem", marginTop: "8px" }}>You are the:</p>
            <p className="play-regular text-lg mb-4" style={{ color: "#f1f1f1", fontSize: "1.5rem", marginTop: "-2px" }}>The Budget Backpacker</p>
            <button className="glass-card play-regular px-4 py-2 rounded-lg transition hover:bg-white/20"
            style={{ color: "#f1f1f1", fontSize: "1.1rem", marginTop: "8px", width: "60%", height: "40px", marginBottom: "8px" }}>
              Retake Quiz!
            </button>
          </div>

          {/* Ongoing Quest */}
          <div className="glass-card p-6" style={{ fontSize: "1.5rem", marginTop: "30px", height: "30%", marginBottom: "8px" }}>
            <h3 className="mb-4 play-regular"
             style={{ fontSize: "1.2rem", marginTop: "10px", marginLeft: "20px", height: "10%", marginBottom: "8px", color: "#f1f1f1" }}
            >Ongoing Quest</h3>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-white/20 rounded flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <span className="text-white play-regular" style={{ fontSize: "1.2rem", marginTop: "8px", marginLeft: "20px", height: "10%", marginBottom: "8px", color: "#f1f1f1" }}>Try 3 Local Coffee Shops!</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2 mb-4">
              <div className="bg-white h-2 rounded-full" style={{ width: '60%' }}></div>
            </div>
            <span className="play-regular justify-center" style={{ textDecoration: "underline", fontSize: ".8rem", marginTop: "8px", marginLeft: "20px", height: "10%", marginBottom: "8px", color: "#f1f1f1", cursor: "pointer" }}>Swap Quest</span>
          </div>

          {/* Travel Statistics */}
          <div className="flex justify-between items-center">
            <div className="text-center play-regular" style={{ color: "#f1f1f1", }}>
              <div className="text-4xl">{stats.savedTrips}</div>
              <div className="text-sm">SAVED<br/>TRIPS</div>
            </div>
            <div className="text-center play-regular" style={{ color: "#f1f1f1" }}>
              <div className="text-4xl">{stats.countriesVisited}</div>
              <div className="text-sm">COUNTRIES<br/>VISITED</div>
            </div>
            <div className="text-center play-regular" style={{ color: "#f1f1f1" }}>
              <div className="text-4xl">{stats.questsCompleted}</div>
              <div className="text-sm">QUEST<br/>COMPLETED</div>
            </div>
          </div>
        </div>

        {/* Right Panel - Travel Plans */}
        <div className="w-3/5">
          {/* Tab Navigation */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex space-x-2">
              <button 
                className={`play-regular glass-card px-4 py-2 text-lg transition ${activeTab === 'past' ? 'text-white' : 'text-gray-400'}`}
                onClick={() => setActiveTab('past')}
                style={{ fontSize: "1.2rem", marginTop: "10px", width: "300%", marginLeft: "300px", height: "10%", color: "#f1f1f1" }}
              >
                Past Travels Plans
              </button>
              <button 
                className={`play-regular glass-card px-4 py-2 text-lg transition ${activeTab === 'liked' ? 'text-white' : 'text-gray-400'}`}
                onClick={() => setActiveTab('liked')}
                style={{ fontSize: "1.2rem", width: "300%", marginTop: "10px", height: "10%", color: "#f1f1f1" }}
              >
                My Liked Plans
              </button>
            </div>
          </div>

          {/* Travel Plans List */}
          <div className="glass-card p-6 max-h-96 overflow-y-auto" style={{ height: "100%", marginLeft: "300px", width: "80%" }}>
            <div className="flex flex-col justify-between h-full space-y-6">
              {currentTravelPlans.map((plan) => (
                <div key={plan.id} className="glass-card p-4 w-full flex-1" style={{ margin: "0 auto", width: "95%", marginTop: "10px", height: "100%" }}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="text-white play-regular text-sm font-medium mb-1">{plan.dates}</div>
                      <div className="text-white play-regular text-xl font-bold mb-2">{plan.destination}</div>
                      <div className="text-white play-regular text-sm mb-1">{plan.type}</div>
                      <div className="text-white play-regular text-sm">{plan.occasion}</div>
                    </div>
                  </div>
                  
                  {/* Itinerary Details */}
                  {plan.itinerary.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {plan.itinerary.map((item, index) => (
                        item.activity && (
                          <div key={index} className="text-white text-sm">
                            <span className="font-medium">{item.day}</span>
                            {item.time && <span className="ml-2">{item.time}</span>}
                            {item.activity && <span className="ml-2">{item.activity}</span>}
                          </div>
                        )
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;