import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import profileImg from '../profile.png';

type Activity = {
  id: string;
  time: string;
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
};

const TripPlanning: React.FC = () => {
  
  const tabs = ['Day One', 'Day Two', 'Day Three'];
  const [activeTab, setActiveTab] = useState(0);

  const mockDays: Activity[][] = [
    [
      {
        id: 'a1',
        time: '04:00 PM - 05:45 PM',
        title: 'Shopping at COEX Mall',
        subtitle: "Experience Korea's mall"
      },
      {
        id: 'a2',
        time: '05:45 PM - 06:00 PM',
        title: 'Subway to Jamsil Station',
        subtitle: 'Take line 2 (Green) Train'
      },
      {
        id: 'a3',
        time: '06:00 PM - 07:30 PM',
        title: 'Dinner @ BBQ',
        subtitle: 'Try famous Korea\'s Crispy Fried Chicken and Beer Combo.',
        description: 'Menu Suggestions: Hwang Geum Olive Chicken, Jamaica Whole Chicken Leg',
      },
      {
        id: 'a4',
        time: '07:30 PM - 08:00 PM',
        title: 'Convenience Store Stop',
        subtitle: 'Grab late night snacks before heading back'
      }
    ],
    [
      { id: 'b1', time: '09:00 AM - 11:00 AM', title: 'Bukchon Hanok Walk', subtitle: 'Explore traditional village' },
      { id: 'b2', time: '12:00 PM - 01:30 PM', title: 'Lunch in Insadong', subtitle: 'Try bibimbap & tea houses' }
    ],
    [
      { id: 'c1', time: '10:00 AM - 12:00 PM', title: 'Gyeongbokgung Palace', subtitle: 'Palace tour and museum' }
    ]
  ];

  const [days, setDays] = useState<Activity[][]>(mockDays);
  const [openActionIds, setOpenActionIds] = useState<Set<string>>(new Set());

  const handleRemove = (id: string) => {
    setDays(prev => prev.map((list, idx) => idx !== activeTab ? list : list.filter(a => a.id !== id)));
  };

  const handleSuggest = (id: string) => {
    // Placeholder interaction
    console.info('Suggest an alternative for', id);
  };

  const toggleActions = (id: string) => {
    setOpenActionIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="tripplanning-page justify-between relative min-h-screen flex flex-col">
      {/* Top bar (same as Landing) */}
      <div className="relative z-10 w-full px-10 py-10 flex justify-between items-center text-white">
        <h1 className="text-3xl font-bold play-regular" style={{ fontSize: '1.5rem', marginLeft: '20px', marginTop: '10px' }}>Xplor</h1>
        <div className="flex items-center gap-4">
          <Link
            to="/how-it-works"
            className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition flex items-center justify-center"
            title="How it works"
            style={{ marginRight: '10px' }}
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
            style={{ marginRight: '20px' }}
          >
            <img 
              src="./src/profile.png" 
              alt="Profile" 
              className="w-6 h-6"
            />
          </Link>
        </div>
      </div>

      <div className="relative z-10 flex flex-1 px-20 gap-24 justify-between" style={{ marginTop: '0px' }}>
      {/* Left Column */}
      <div className="w-2/5 space-y-6">
        <div className="glass-card p-6" style={{ height: '86vh', marginLeft: '50px', marginTop: '30px', color: '#f1f1f1' }}>
          <div className="text-white">
            <h2 className="play-regular" style={{ fontSize: '2rem', marginLeft: '50px' }}>Trip Details:</h2>
        </div>
          <div className="mt-4 flex gap-6">
            <div className="w-40 h-28 bg-white/20 rounded-lg flex items-center justify-center">
                </div>
            <div className="flex-1 grid grid-cols-2 text-white play-regular justify-end" style={{ marginLeft: '40px' }}>
              <div className="opacity-80 text-sm">Destination:</div>
              <div className="text-lg" style={{ fontSize: '25px' }}>South Korea</div>
              <div className="opacity-80 text-sm">Dates:</div>
              <div className="text-lg" style={{ fontSize: '25px' }}>Sept 26 - Sept 29</div>
              <div className="opacity-80 text-sm">Group Size:</div>
              <div className="text-lg" style={{ fontSize: '25px' }}>Couple</div>
              <div className="opacity-80 text-sm">Budget:</div>
              <div className="text-lg" style={{ fontSize: '25px' }}>5,000 USD</div>
              <div className="opacity-80 text-sm">Occasion:</div>
              <div className="text-lg" style={{ fontSize: '25px' }}>Anniversary</div>
            </div>
          </div>
          <div className="mt-6">
            <span
              className="play-regular text-white cursor-pointer"
              style={{
                fontSize: '.9rem',
                marginLeft: '40px',
                marginBottom: '20px',
                display: 'inline-block',
                textDecoration: 'underline',
                textDecorationColor: '#ffffff',
                textDecorationThickness: '2px',
                textUnderlineOffset: '3px'
              }}
            >
              Edit My Trip
            </span>
          </div>

          {/* My Travel Style merged inside */}
          <div className="mt-8">
            <div className="text-white">
              <h3 className="play-regular mb-4" style={{ fontSize: '1.5rem', marginLeft: '40px' }}>My Travel Style:</h3>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1 text-white play-regular">
                <div className="text-lg mb-1" style={{ marginLeft: '40px' }}>The Budget Backpacker</div>
                <div className="text-xs opacity-80" style={{ marginLeft: '40px' }}>Stretch every dollar, chase every experience. The world is your hostel.</div>
                <div className="mt-4">
                  <button className="glass-button play-regular px-4 py-2 rounded-lg text-white text-sm"  style={{ fontSize: '1rem', marginLeft: '40px', width: '40%', height: '40px', marginTop: '80px' }}>Retake Quiz</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="w-3/5 ml-auto" style={{ marginRight: '80px', marginTop: '30px', width: '45%', height: '100vh' }}>
        <div className="flex justify-start gap-10 mb-4" style={{ marginBottom: '20px',}}>
          {tabs.map((t, i) => (
            <button
              key={t}
              className={`tab-pill ${i === activeTab ? 'tab-pill-active' : ''} play-regular`}
              onClick={() => setActiveTab(i)}
            >
              {t}
            </button>
          ))}
            </div>

        <div className="glass-card p-6" style={{ height: '78vh', overflowY: 'auto' }}>
          <div className="space-y-4">
            {days[activeTab].map((activity) => (
              <div key={activity.id}>
                <div className="glass-card justify-between items-center overflow-hidden p-5" style={{ height: '50%', width: '95%', cursor: 'pointer', marginLeft: '15px', marginTop: '10px' }} onClick={() => toggleActions(activity.id)}>
                  <div className="flex-l gap-4 items-start">
                    <div className="play-regular min-w-[170px]" style={{ marginLeft: '15px', fontSize: '0.9rem' }}>{activity.time}</div>
                    <div className="flex-1">
                      <div className="text-white play-regular" style={{ marginLeft: '15px', fontSize: '1.6rem' }}>{activity.title}</div>
                      {activity.subtitle && (
                        <div className="text-white/80 text-sm mt-1" style={{ marginLeft: '15px' }}>{activity.subtitle}</div>
                      )}
                      {activity.description && (
                        <div className="text-white/80 text-sm mt-3" style={{ marginLeft: '15px' }}>{activity.description}</div>
                      )}
                    </div>
                    {activity.image && (
                      <img src={activity.image} alt="activity" className="w-28 h-24 rounded-lg object-cover" />
                    )}
                  </div>
                </div>

                {/* Sliding action panel that pushes content below */}
                <div className={`trip-action-panel ${openActionIds.has(activity.id) ? 'open' : ''}`} style={{ width: '95%', marginLeft: '15px' }}>
                  <div className="panel-inner">
                    <span
                      className="action-text"
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleRemove(activity.id); } }}
                      onClick={(e) => { e.stopPropagation(); handleRemove(activity.id); }}
                    >
                      Remove?
                    </span>
                    <span
                      className="action-text"
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleSuggest(activity.id); } }}
                      onClick={(e) => { e.stopPropagation(); handleSuggest(activity.id); }}
                    >
                      Suggest you an alternative?
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default TripPlanning;
