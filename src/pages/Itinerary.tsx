import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, Clock, MapPin, Navigation, CheckCircle, Star, DollarSign, Users, Lightbulb, Heart, Share2, Download, Sparkles, MessageSquare } from 'lucide-react';
import { useTravel } from '../contexts/TravelContext';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Itinerary: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentItinerary, userLocation } = useTravel();
  const [activeTab, setActiveTab] = useState<'itinerary' | 'recommendations' | 'budget'>('itinerary');
  const [showAIResponse, setShowAIResponse] = useState(false);

  // Use current itinerary if available, otherwise show demo data
  const itinerary = currentItinerary || {
    id: 'demo-trip',
    userId: 'demo-user',
    tripInput: {
      destination: 'Tokyo, Japan',
      startDate: new Date('2024-11-05'),
      endDate: new Date('2024-11-12'),
      travelers: 2,
      specialInterests: ['culture', 'food'],
      constraints: [],
      budget: 2750
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true,
    days: [
      {
        date: new Date('2024-11-05'),
        activities: [
          {
            id: '1',
            name: 'Arrival & Shibuya Exploration',
            description: 'Arrive at Narita Airport, check into hotel, and explore the famous Shibuya crossing',
            location: {
              name: 'Shibuya Crossing',
              address: 'Shibuya, Tokyo, Japan',
              coordinates: { lat: 35.6598, lng: 139.7006 }
            },
            startTime: new Date('2024-11-05T14:00:00'),
            endTime: new Date('2024-11-05T18:00:00'),
            estimatedDuration: 240,
            category: 'sightseeing' as const,
            priority: 'high' as const,
            isCompleted: true
          },
          {
            id: '2',
            name: 'Traditional Ramen Dinner',
            description: 'Experience authentic Tokyo ramen at a local shop',
            location: {
              name: 'Ichiran Ramen Shibuya',
              address: 'Shibuya, Tokyo, Japan',
              coordinates: { lat: 35.6590, lng: 139.7016 }
            },
            startTime: new Date('2024-11-05T19:00:00'),
            endTime: new Date('2024-11-05T20:30:00'),
            estimatedDuration: 90,
            category: 'cultural' as const,
            priority: 'medium' as const,
            isCompleted: true
          }
        ],
        meals: [],
        transportation: []
      },
      {
        date: new Date('2024-11-06'),
        activities: [
          {
            id: '3',
            name: 'Tsukiji Outer Market Food Tour',
            description: 'Early morning food tour through the famous fish market',
            location: {
              name: 'Tsukiji Outer Market',
              address: 'Tsukiji, Chuo City, Tokyo, Japan',
              coordinates: { lat: 35.6654, lng: 139.7707 }
            },
            startTime: new Date('2024-11-06T06:00:00'),
            endTime: new Date('2024-11-06T09:00:00'),
            estimatedDuration: 180,
            category: 'cultural' as const,
            priority: 'high' as const,
            isCompleted: false
          },
          {
            id: '4',
            name: 'Senso-ji Temple Visit',
            description: 'Visit Tokyo\'s oldest temple and explore Asakusa district',
            location: {
              name: 'Senso-ji Temple',
              address: 'Asakusa, Taito City, Tokyo, Japan',
              coordinates: { lat: 35.7148, lng: 139.7967 }
            },
            startTime: new Date('2024-11-06T10:30:00'),
            endTime: new Date('2024-11-06T13:00:00'),
            estimatedDuration: 150,
            category: 'cultural' as const,
            priority: 'high' as const,
            isCompleted: false
          }
        ],
        meals: [],
        transportation: []
      }
    ],
    aiResponse: `🎯 PERSONALIZED RECOMMENDATION SUMMARY

Based on your travel profile and preferences, I've crafted a perfect 7-day Tokyo adventure that balances cultural immersion with modern experiences. This itinerary combines must-see landmarks with hidden local gems, authentic dining experiences, and activities tailored to your interests.

🗺️ DESTINATION ANALYSIS

Tokyo is ideal for your travel style because it offers incredible diversity - from ancient temples to cutting-edge technology, world-class cuisine to vibrant street culture. November is perfect timing with comfortable weather, beautiful autumn colors, and fewer crowds than peak season.

📅 DETAILED ITINERARY

**Day 1 - November 5th - Arrival & First Impressions**
- **Morning (9:00-12:00)**: Airport arrival and hotel check-in
  - Duration: 3 hours
  - Why it fits your profile: Gentle start to adjust to time zone
  - Pro tip: Use the Airport Express for fastest city access

- **Lunch (12:00-13:30)**: Conveyor belt sushi at Sushi Zanmai Honten
  - Budget: $25-35 per person
  - Specialty: Fresh tuna and seasonal fish

- **Afternoon (14:00-17:00)**: Shibuya Crossing & Hachiko Statue
  - Duration: 3 hours
  - Transportation: JR Yamanote Line, 5 minutes, $2
  - Experience the world's busiest pedestrian crossing

- **Evening (18:00-21:00)**: Traditional ramen dinner in Shibuya
  - Experience type: Cultural/Culinary
  - Local connection: Tokyo's most famous comfort food

💰 BUDGET BREAKDOWN
- **Accommodation**: $120 per night × 7 nights = $840
- **Transportation**: Local $50 + International $800 = $850
- **Food**: $80 per day × 7 days = $560
- **Activities**: $300 total for temples, museums, and experiences
- **Miscellaneous**: Shopping, tips, emergencies = $200
- **Total Estimated**: $2,750 (with 10% buffer)

🎒 PRACTICAL GUIDE
- **Packing essentials**: Comfortable walking shoes, portable WiFi device, cash for small vendors
- **Cultural etiquette**: Bow slightly when greeting, remove shoes when entering homes/temples
- **Language basics**: "Arigatou gozaimasu" (thank you), "Sumimasen" (excuse me)
- **Safety considerations**: Tokyo is extremely safe, keep emergency contacts handy
- **Local transportation**: Get a 7-day JR Pass for unlimited train travel

🌟 PERSONALIZATION TOUCHES
- **Hidden gems**: Visit the teamLab Borderless digital art museum for a unique modern experience
- **Local connections**: Morning visit to Tsukiji Outer Market for authentic sushi breakfast
- **Seasonal specials**: Autumn illuminations at Tokyo Station and Roppongi Hills
- **Future trip seeds**: Consider Kyoto for your next Japan adventure to experience traditional culture`,
    parsedData: {
      summary: "Based on your travel profile and preferences, I've crafted a perfect 7-day Tokyo adventure that balances cultural immersion with modern experiences.",
      days: [
        {
          day: 1,
          date: "November 5th",
          activities: ["Shibuya Crossing & Hachiko Statue", "Traditional ramen dinner in Shibuya"],
          meals: ["Conveyor belt sushi at Sushi Zanmai Honten"],
          notes: "Gentle start to adjust to time zone"
        },
        {
          day: 2,
          date: "November 6th", 
          activities: ["Tsukiji Outer Market Food Tour", "Senso-ji Temple Visit"],
          meals: ["Authentic sushi breakfast at Tsukiji"],
          notes: "Early morning start for best market experience"
        }
      ],
      budget: {
        total: 2750,
        breakdown: {
          accommodation: 840,
          transportation: 850,
          food: 560,
          activities: 300,
          miscellaneous: 200
        }
      },
      tips: [
        "Get a 7-day JR Pass for unlimited train travel",
        "Keep cash handy for small vendors",
        "Bow slightly when greeting locals"
      ]
    }
  };

  if (!itinerary) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner text="Loading itinerary..." />
      </div>
    );
  }

  const currentDate = new Date();
  const isCurrentTrip = itinerary.tripInput.startDate <= currentDate && currentDate <= itinerary.tripInput.endDate;

  const getCategoryColor = (category: string) => {
    const colors = {
      sightseeing: 'bg-blue-100 text-blue-800',
      cultural: 'bg-purple-100 text-purple-800',
      adventure: 'bg-green-100 text-green-800',
      relaxation: 'bg-yellow-100 text-yellow-800',
      shopping: 'bg-pink-100 text-pink-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || colors.other;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}m` : ''}`;
    }
    return `${mins}m`;
  };

  const renderAIRecommendations = () => {
    if (!itinerary.aiResponse) {
      return (
        <div className="text-center py-8">
          <Sparkles className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500">No AI recommendations available</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* AI Response Toggle */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">AI Travel Recommendations</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAIResponse(!showAIResponse)}
            icon={<MessageSquare size={16} />}
          >
            {showAIResponse ? 'Hide Details' : 'Show Full Response'}
          </Button>
        </div>

        {/* Parsed Summary */}
        {itinerary.parsedData?.summary && (
          <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <Sparkles className="w-6 h-6 text-primary-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-primary-900 mb-2">Personalized for You</h4>
                <p className="text-primary-800">{itinerary.parsedData.summary}</p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Tips */}
        {itinerary.parsedData?.tips && (
          <div className="bg-yellow-50 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <Lightbulb className="w-6 h-6 text-yellow-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-yellow-900 mb-3">Pro Tips</h4>
                <ul className="space-y-2">
                  {itinerary.parsedData.tips.map((tip: string, index: number) => (
                    <li key={index} className="text-yellow-800 flex items-start">
                      <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Full AI Response */}
        {showAIResponse && (
          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Complete AI Analysis</h4>
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap text-gray-700 font-sans">
                {itinerary.aiResponse}
              </pre>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderBudgetBreakdown = () => {
    if (!itinerary.parsedData?.budget) {
      return (
        <div className="text-center py-8">
          <DollarSign className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500">No budget information available</p>
        </div>
      );
    }

    const budget = itinerary.parsedData.budget;
    const categories = Object.entries(budget.breakdown || {});

    return (
      <div className="space-y-6">
        {/* Total Budget */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-green-900">Total Estimated Budget</h3>
              <p className="text-green-700">Including 10% buffer for unexpected expenses</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-900">${budget.total?.toLocaleString()}</div>
              <div className="text-sm text-green-600">for {itinerary.tripInput?.travelers || 1} traveler(s)</div>
            </div>
          </div>
        </div>

        {/* Budget Breakdown */}
        <div className="grid md:grid-cols-2 gap-4">
          {categories.map(([category, amount]) => {
            const percentage = budget.total ? ((amount as number) / budget.total * 100) : 0;
            return (
              <div key={category} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 capitalize">
                    {category.replace('_', ' ')}
                  </h4>
                  <span className="text-lg font-semibold text-gray-900">
                    ${(amount as number).toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {percentage.toFixed(1)}% of total budget
                </div>
              </div>
            );
          })}
        </div>

        {/* Budget Tips */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h4 className="font-semibold text-blue-900 mb-3">Money-Saving Tips</h4>
          <ul className="space-y-2 text-blue-800">
            <li>• Book accommodations 2-3 months in advance for better rates</li>
            <li>• Use local transportation passes for significant savings</li>
            <li>• Eat at local markets and street food vendors for authentic, affordable meals</li>
            <li>• Look for free walking tours and museum free days</li>
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {itinerary.tripInput.destination}
            </h1>
            <div className="flex items-center space-x-4 text-gray-600">
              <div className="flex items-center space-x-1">
                <Calendar size={16} />
                <span>
                  {itinerary.tripInput.startDate.toLocaleDateString()} - {itinerary.tripInput.endDate.toLocaleDateString()}
                </span>
              </div>
              {itinerary.tripInput.travelers && (
                <div className="flex items-center space-x-1">
                  <Users size={16} />
                  <span>{itinerary.tripInput.travelers} traveler{itinerary.tripInput.travelers > 1 ? 's' : ''}</span>
                </div>
              )}
              {isCurrentTrip && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active Trip
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" icon={<Heart size={16} />}>
              Save
            </Button>
            <Button variant="outline" size="sm" icon={<Share2 size={16} />}>
              Share
            </Button>
            <Button variant="outline" size="sm" icon={<Download size={16} />}>
              Export
            </Button>
            {isCurrentTrip && (
              <Button variant="primary" size="sm" icon={<Navigation size={16} />}>
                Get Directions
              </Button>
            )}
          </div>
        </div>

        {/* Location Status */}
        {userLocation && isCurrentTrip && (
          <div className="mt-4 p-3 bg-primary-50 rounded-lg">
            <div className="flex items-center space-x-2 text-sm text-primary-700">
              <MapPin size={16} />
              <span>Current location tracked • Itinerary will adapt automatically</span>
            </div>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'itinerary', label: 'Daily Itinerary', icon: Calendar },
              { id: 'recommendations', label: 'AI Recommendations', icon: Sparkles },
              { id: 'budget', label: 'Budget Breakdown', icon: DollarSign }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon size={16} />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'itinerary' && (
            <div className="space-y-6">
              {/* Daily Itinerary */}
              {itinerary.days.map((day, dayIndex) => {
                const isToday = day.date.toDateString() === currentDate.toDateString();
                
                return (
                  <div key={dayIndex} className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                    {/* Day Header */}
                    <div className={`p-4 border-b border-gray-200 ${isToday ? 'bg-primary-50' : 'bg-white'}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-xl font-semibold text-gray-900">
                            Day {dayIndex + 1}
                          </h2>
                          <p className={`text-sm ${isToday ? 'text-primary-600' : 'text-gray-600'}`}>
                            {day.date.toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                            {isToday && ' • Today'}
                          </p>
                        </div>
                        <div className="text-sm text-gray-500">
                          {day.activities.length} activities planned
                        </div>
                      </div>
                    </div>

                    {/* Activities */}
                    <div className="p-6 space-y-4">
                      {day.activities.map((activity, activityIndex) => (
                        <div 
                          key={activity.id}
                          className={`border border-gray-200 rounded-lg p-4 bg-white ${
                            activity.isCompleted ? 'ring-2 ring-green-200' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                  activity.isCompleted ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                                }`}>
                                  {activity.isCompleted ? <CheckCircle size={16} /> : activityIndex + 1}
                                </div>
                                <div>
                                  <h3 className="font-semibold text-gray-900">{activity.name}</h3>
                                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                                    <span className="flex items-center space-x-1">
                                      <Clock size={14} />
                                      <span>{formatTime(activity.startTime)} - {formatTime(activity.endTime)}</span>
                                    </span>
                                    <span>({formatDuration(activity.estimatedDuration)})</span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(activity.category)}`}>
                                      {activity.category}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              
                              <p className="text-gray-700 mb-3 ml-11">
                                {activity.description}
                              </p>
                              
                              <div className="flex items-center space-x-2 text-sm text-gray-600 ml-11">
                                <MapPin size={14} />
                                <span>{activity.location.name}</span>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center space-x-2 ml-4">
                              {!activity.isCompleted && isCurrentTrip && (
                                <Button variant="outline" size="sm">
                                  Mark Complete
                                </Button>
                              )}
                              <Button variant="ghost" size="sm" icon={<Navigation size={14} />}>
                                Navigate
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}

                      {day.activities.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                          <p>No activities planned for this day</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'recommendations' && renderAIRecommendations()}
          {activeTab === 'budget' && renderBudgetBreakdown()}
        </div>
      </div>

      {/* Real-time Updates Notice */}
      {isCurrentTrip && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            </div>
            <div>
              <h4 className="font-medium text-blue-900 mb-1">Smart Adaptation Active</h4>
              <p className="text-sm text-blue-700">
                Your itinerary will automatically adjust based on your location, pace, and any delays. 
                Enjoy your trip and let us handle the scheduling!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Itinerary;