import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, MapPin, Calendar, Clock, TrendingUp, Users2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTravel } from '../contexts/TravelContext';
import Button from '../components/common/Button';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { currentItinerary, travelProfile } = useTravel();

  // Mock data for demonstration
  const recentTrips = [
    {
      id: '1',
      destination: 'Tokyo, Japan',
      dates: 'Nov 5-12, 2024',
      status: 'completed',
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop'
    },
    {
      id: '2',
      destination: 'Paris, France',
      dates: 'Sep 15-22, 2024',
      status: 'completed',
      image: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&h=300&fit=crop'
    }
  ];

  const stats = [
    {
      label: 'Countries Visited',
      value: '12',
      icon: <MapPin className="w-5 h-5 text-primary-600" />,
      change: '+2 this year'
    },
    {
      label: 'Total Trips',
      value: '28',
      icon: <Calendar className="w-5 h-5 text-primary-600" />,
      change: '+6 this year'
    },
    {
      label: 'Hours Saved',
      value: '147',
      icon: <Clock className="w-5 h-5 text-primary-600" />,
      change: 'vs manual planning'
    },
    {
      label: 'Travel Score',
      value: '9.2',
      icon: <TrendingUp className="w-5 h-5 text-primary-600" />,
      change: '+0.3 this month'
    }
  ];

  return (
    <div className="min-h-screen relative">
      {/* Sophisticated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50/30 via-white/20 to-accent-50/30 pointer-events-none" />
      
      <div className="relative z-10 space-y-12 pb-20">
        {/* Hero Welcome Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-100/20 to-accent-100/20 rounded-3xl" />
          <div className="relative glass-strong rounded-3xl p-12 border border-white/20 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div className="max-w-2xl">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center">
                    <span className="text-2xl">👋</span>
                  </div>
                  <div className="px-4 py-2 glass-card rounded-full">
                    <span className="text-sm font-medium text-primary-600">Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}</span>
                  </div>
                </div>
                <h1 className="text-5xl font-extrabold mb-4 text-glass leading-tight">
                  Welcome back,<br />
                  <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                    {user?.displayName || 'Explorer'}
                  </span>
                </h1>
                <p className="text-glass/80 text-xl leading-relaxed mb-8">
                  Ready to craft your next extraordinary adventure? Let's create memories that will last a lifetime.
                </p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 px-4 py-2 glass-card rounded-full">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-sm text-glass/70">AI Assistant Ready</span>
                  </div>
                  <div className="flex items-center space-x-2 px-4 py-2 glass-card rounded-full">
                    <span className="text-sm text-glass/70">Last trip: 2 weeks ago</span>
                  </div>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-primary-400 to-accent-400 rounded-3xl blur opacity-20" />
                  <Link to="/plan-trip">
                    <Button 
                      variant="primary" 
                      size="lg"
                      className="relative px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                      icon={<PlusCircle size={24} />}
                    >
                      Start New Adventure
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sophisticated Trip Planning Section */}
        <div className="relative">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 px-6 py-3 glass-card rounded-full mb-6">
              <div className="w-2 h-2 bg-primary-500 rounded-full" />
              <span className="text-sm font-medium text-primary-600">AI-Powered Planning</span>
            </div>
            <h2 className="text-4xl font-bold text-glass mb-4">
              Craft Your Perfect Journey
            </h2>
            <p className="text-glass/70 text-lg max-w-2xl mx-auto">
              Our intelligent assistant creates personalized itineraries tailored to your preferences and travel style.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8">
            {/* Main Planning Form */}
            <div className="lg:col-span-8 space-y-6">
              {/* Destination Selection Card */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-400 to-accent-400 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300" />
                <div className="relative glass-strong rounded-2xl p-8 border border-white/20">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary-400 to-accent-400 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-glass">Destination & Timeline</h3>
                      <p className="text-glass/60 text-sm">Where dreams meet reality</p>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="✈️ Where shall we take you next?"
                        className="w-full px-8 py-6 glass-card text-glass placeholder-gray-500/70 focus:ring-2 focus:ring-primary-400 text-xl font-medium rounded-2xl border border-white/10 backdrop-blur-sm transition-all duration-300 focus:border-primary-400/50"
                      />
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <div className="w-8 h-8 glass rounded-lg flex items-center justify-center">
                          <span className="text-lg">🌍</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="block text-sm font-semibold text-glass/80 tracking-wide">DEPARTURE</label>
                        <input 
                          type="date" 
                          className="w-full px-6 py-4 glass-card text-glass focus:ring-2 focus:ring-primary-400 rounded-xl border border-white/10 backdrop-blur-sm transition-all duration-300"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="block text-sm font-semibold text-glass/80 tracking-wide">RETURN</label>
                        <input 
                          type="date" 
                          className="w-full px-6 py-4 glass-card text-glass focus:ring-2 focus:ring-primary-400 rounded-xl border border-white/10 backdrop-blur-sm transition-all duration-300"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Travel Preferences Card */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-400 to-primary-400 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300" />
                <div className="relative glass-strong rounded-2xl p-8 border border-white/20">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-accent-400 to-primary-400 flex items-center justify-center">
                      <Users2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-glass">Travel Preferences</h3>
                      <p className="text-glass/60 text-sm">Tailored to your style</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-glass/80 tracking-wide">GROUP SIZE</label>
                      <select className="w-full px-6 py-4 glass-card text-glass focus:ring-2 focus:ring-primary-400 rounded-xl border border-white/10 backdrop-blur-sm transition-all duration-300">
                        <option>👤 Solo Adventure</option>
                        <option>💑 Couple Escape</option>
                        <option>👨‍👩‍👧‍👦 Family Journey</option>
                        <option>👥 Group Experience</option>
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-glass/80 tracking-wide">TRIP STYLE</label>
                      <select className="w-full px-6 py-4 glass-card text-glass focus:ring-2 focus:ring-primary-400 rounded-xl border border-white/10 backdrop-blur-sm transition-all duration-300">
                        <option>🏖️ Relaxation Retreat</option>
                        <option>🏔️ Adventure Quest</option>
                        <option>🏛️ Cultural Discovery</option>
                        <option>💼 Business & Leisure</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <label className="block text-sm font-semibold text-glass/80 tracking-wide">PREFERENCES</label>
                    <div className="flex flex-wrap gap-3">
                      {[
                        { icon: '💰', label: 'Budget Conscious', color: 'from-green-400 to-emerald-500' },
                        { icon: '⚡', label: 'Fast Paced', color: 'from-yellow-400 to-orange-500' },
                        { icon: '🍴', label: 'Culinary Focus', color: 'from-red-400 to-pink-500' },
                        { icon: '📸', label: 'Photography', color: 'from-purple-400 to-indigo-500' },
                        { icon: '🧘', label: 'Wellness', color: 'from-blue-400 to-cyan-500' },
                        { icon: '🎨', label: 'Art & Culture', color: 'from-pink-400 to-rose-500' }
                      ].map((pref) => (
                        <label key={pref.label} className="group cursor-pointer">
                          <input type="checkbox" className="sr-only" />
                          <div className={`relative px-6 py-3 glass-card rounded-xl border border-white/10 backdrop-blur-sm transition-all duration-300 hover:border-white/30 group-hover:shadow-lg flex items-center space-x-3`}>
                            <span className="text-lg">{pref.icon}</span>
                            <span className="text-sm font-medium text-glass">{pref.label}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Panel */}
            <div className="lg:col-span-4 space-y-6">
              {/* AI Generation Card */}
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-400 via-purple-500 to-accent-400 rounded-2xl blur opacity-30" />
                <div className="relative glass-strong rounded-2xl p-8 text-center border border-white/20">
                  <div className="mb-8">
                    <div className="w-20 h-20 mx-auto glass rounded-2xl flex items-center justify-center mb-6 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-accent-400 opacity-20" />
                      <span className="text-3xl relative z-10">🤖</span>
                    </div>
                    <h3 className="text-2xl font-bold text-glass mb-3">AI Trip Planner</h3>
                    <p className="text-glass/70 text-sm leading-relaxed">
                      Let our advanced AI create a personalized itinerary based on your preferences and travel style.
                    </p>
                  </div>
                  
                  <Link to="/plan-trip">
                    <Button 
                      size="lg" 
                      variant="primary" 
                      className="w-full text-lg py-4 font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 bg-gradient-to-r from-primary-500 to-accent-500"
                    >
                      ✨ Generate My Journey
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="glass-card rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-bold text-glass mb-6 flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-primary-500" />
                  <span>Your Travel Story</span>
                </h3>
                <div className="space-y-6">
                  {[
                    { icon: MapPin, label: 'Countries Explored', value: '12', color: 'text-blue-500' },
                    { icon: Calendar, label: 'Adventures Completed', value: '28', color: 'text-green-500' },
                    { icon: Clock, label: 'Planning Hours Saved', value: '147', color: 'text-purple-500' }
                  ].map((stat, index) => (
                    <div key={index} className="flex items-center justify-between group hover:bg-white/5 rounded-lg p-3 -m-3 transition-all duration-200">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 glass rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                          <stat.icon className={`w-4 h-4 ${stat.color}`} />
                        </div>
                        <span className="text-glass/80 text-sm font-medium">{stat.label}</span>
                      </div>
                      <span className="text-2xl font-bold text-glass">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Travel Profile Enhancement */}
        {!travelProfile && (
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl blur opacity-25 group-hover:opacity-35 transition duration-300" />
            <div className="relative glass-strong rounded-2xl p-8 border border-yellow-400/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-400 flex items-center justify-center">
                      <span className="text-2xl">🎯</span>
                    </div>
                    <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl blur opacity-20" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-glass mb-2">
                      Unlock Personalized Travel Magic
                    </h3>
                    <p className="text-glass/70 text-lg leading-relaxed max-w-lg">
                      Complete your travel profile to receive AI-powered recommendations tailored specifically to your preferences and travel style.
                    </p>
                    <div className="flex items-center space-x-4 mt-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                        <span className="text-sm text-glass/60">2 minutes to complete</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full" />
                        <span className="text-sm text-glass/60">Instant recommendations</span>
                      </div>
                    </div>
                  </div>
                </div>
                <Link to="/quiz">
                  <Button 
                    variant="primary" 
                    size="lg"
                    className="px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 bg-gradient-to-r from-yellow-400 to-orange-400 text-white"
                  >
                    Start Quiz ✨
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Current Active Trip */}
        {currentItinerary && (
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-blue-400 rounded-2xl blur opacity-25" />
            <div className="relative glass-strong rounded-2xl p-8 border border-green-400/20">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-400 to-blue-400 flex items-center justify-center">
                      <span className="text-xl">🧳</span>
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-glass">Your Active Journey</h2>
                    <p className="text-glass/60">Currently in progress</p>
                  </div>
                </div>
                <Link to={`/itinerary/${currentItinerary.id}`}>
                  <Button 
                    variant="primary" 
                    size="lg"
                    className="px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    View Journey Details
                  </Button>
                </Link>
              </div>
              
              <div className="glass-card rounded-2xl p-8 border border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-primary-400 to-accent-400 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-white/10" />
                      <MapPin className="w-10 h-10 text-white relative z-10" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-glass mb-2">
                        {currentItinerary.tripInput.destination}
                      </h3>
                      <p className="text-glass/80 text-lg mb-3">
                        {currentItinerary.tripInput.startDate.toLocaleDateString()} - {currentItinerary.tripInput.endDate.toLocaleDateString()}
                      </p>
                      <div className="flex items-center space-x-3">
                        <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-400 to-blue-400 text-white text-sm font-semibold rounded-full">
                          ✈️ Active Trip
                        </span>
                        <span className="inline-flex items-center px-4 py-2 glass-card text-sm font-medium text-glass rounded-full">
                          Day 3 of 7
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-glass mb-1">73%</div>
                    <div className="text-glass/60 text-sm">Complete</div>
                    <div className="w-20 h-2 glass rounded-full mt-2 overflow-hidden">
                      <div className="w-3/4 h-full bg-gradient-to-r from-green-400 to-blue-400 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Travel Memory Gallery */}
        <div className="relative">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                <span className="text-xl">📸</span>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-glass">Travel Memory Gallery</h2>
                <p className="text-glass/60">Your collection of extraordinary adventures</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="lg"
              className="px-6 py-3 border-2 border-white/20 hover:border-white/40 transition-all duration-300"
            >
              View All Memories
            </Button>
          </div>
          
          {recentTrips.length > 0 ? (
            <div className="grid lg:grid-cols-2 gap-8">
              {recentTrips.map((trip, index) => (
                <div key={trip.id} className="group relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300" />
                  <div className="relative glass-strong rounded-3xl overflow-hidden border border-white/20 hover:border-white/40 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl">
                    <div className="relative h-64 overflow-hidden">
                      <img 
                        src={trip.image} 
                        alt={trip.destination}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute top-4 right-4">
                        <div className="glass-card rounded-full px-4 py-2 border border-white/20">
                          <span className="text-white text-sm font-medium">✨ {index === 0 ? 'Latest' : 'Memory'}</span>
                        </div>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-2xl font-bold text-white mb-1">
                          {trip.destination}
                        </h3>
                        <p className="text-white/80 text-sm">
                          {trip.dates}
                        </p>
                      </div>
                    </div>
                    
                    <div className="p-8">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-green-400 to-emerald-400 flex items-center justify-center">
                            <span className="text-white text-sm">✓</span>
                          </div>
                          <span className="text-glass font-semibold">Adventure Complete</span>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-glass">9.2</div>
                          <div className="text-glass/60 text-xs">Trip Rating</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="text-center glass-card rounded-xl p-3">
                          <div className="text-lg font-bold text-glass">5</div>
                          <div className="text-xs text-glass/60">Days</div>
                        </div>
                        <div className="text-center glass-card rounded-xl p-3">
                          <div className="text-lg font-bold text-glass">12</div>
                          <div className="text-xs text-glass/60">Activities</div>
                        </div>
                        <div className="text-center glass-card rounded-xl p-3">
                          <div className="text-lg font-bold text-glass">47</div>
                          <div className="text-xs text-glass/60">Photos</div>
                        </div>
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        className="w-full py-3 glass-button hover:glass-strong transition-all duration-300 font-semibold"
                      >
                        View Trip Details & Photos
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="relative mb-8">
                <div className="w-32 h-32 mx-auto rounded-3xl bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/10" />
                  <span className="text-5xl relative z-10">🗺️</span>
                </div>
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-3xl blur opacity-20" />
              </div>
              
              <h3 className="text-3xl font-bold text-glass mb-4">
                Your Adventure Story Awaits
              </h3>
              <p className="text-glass/70 text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
                Every great journey begins with a single step. Let our AI-powered travel assistant craft your first extraordinary adventure.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Link to="/plan-trip">
                  <Button 
                    variant="primary" 
                    size="lg" 
                    className="px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5"
                    icon={<PlusCircle size={24} />}
                  >
                    Create Your First Adventure
                  </Button>
                </Link>
                <Link to="/quiz">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="px-8 py-4 text-lg font-semibold border-2 border-white/20 hover:border-white/40 transition-all duration-300"
                  >
                    Take Travel Quiz
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Floating Action Button (Mobile) */}
        <div className="lg:hidden fixed bottom-8 right-8 z-50">
          <div className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-primary-400 to-accent-400 rounded-full blur opacity-30 group-hover:opacity-50 transition duration-300" />
            <Link to="/plan-trip">
              <Button 
                variant="primary"
                size="lg"
                className="relative w-16 h-16 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 bg-gradient-to-r from-primary-500 to-accent-500 p-0"
                icon={<PlusCircle size={28} />}
                children=""
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
