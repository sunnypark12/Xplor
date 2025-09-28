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
    <div className="tripplanning-page relative min-h-screen flex flex-col">
      {/* Main content */}
      <div className="relative z-10 flex flex-1 px-20 gap-16" style={{ marginTop: '20px', marginLeft: "100px"}}>
        {/* Left Panel - Trip Details */}
        <div className="w-2/5 space-y-6">
          <div className="glass-card p-6" style={{ height: '81vh', marginTop: '30px', marginRight: "70px" , color: '#f1f1f1' }}>
          <div className="text-white">
            <h2 className="play-regular" style={{ fontSize: '2rem', marginLeft: '40px' }}>Trip Details:</h2>
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
                <div className="mt-4">
                  <button className="glass-button play-regular px-4 py-2 rounded-lg text-white text-sm"  style={{ fontSize: '1rem', marginLeft: '40px', width: '40%', height: '40px', marginTop: '80px' }}>Retake Quiz</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

        {/* Right Panel - Itinerary */}
        <div className="w-2/5">
          {/* Tab Navigation */}
          <div className="flex items-center justify-start mb-6" style={{ marginTop: '30px', marginLeft: '50px', marginBottom: '10px' }}>
            <div className="flex space-x-4">
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
          </div>

          {/* Itinerary List */}
          <div className="glass-card p-4" style={{ height: '78vh', overflowY: 'auto', marginLeft: '40px' }}>
            <div className="flex flex-col justify-between h-full space-y-6">
              {days[activeTab].map((activity) => (
                <div key={activity.id}>
                  <div className="glass-card justify-between items-center overflow-hidden p-5" style={{ cursor: 'pointer', marginTop: '10px'}} onClick={() => toggleActions(activity.id)}>
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

                    {/* Sliding action panel that pushes content below */}
                    <div className={`trip-action-panel ${openActionIds.has(activity.id) ? 'open' : ''}`}>
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