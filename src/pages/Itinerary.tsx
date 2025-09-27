import React from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, Clock, MapPin, Navigation, CheckCircle } from 'lucide-react';
import { useTravel } from '../contexts/TravelContext';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Itinerary: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentItinerary, userLocation } = useTravel();

  // For demo purposes, we'll use mock data
  // In a real app, you'd fetch the itinerary by ID
  const mockItinerary = {
    id: 'demo-trip',
    destination: 'Tokyo, Japan',
    startDate: new Date('2024-11-05'),
    endDate: new Date('2024-11-12'),
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
    ]
  };

  if (!mockItinerary) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner text="Loading itinerary..." />
      </div>
    );
  }

  const currentDate = new Date();
  const isCurrentTrip = mockItinerary.startDate <= currentDate && currentDate <= mockItinerary.endDate;

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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {mockItinerary.destination}
            </h1>
            <div className="flex items-center space-x-4 text-gray-600">
              <div className="flex items-center space-x-1">
                <Calendar size={16} />
                <span>
                  {mockItinerary.startDate.toLocaleDateString()} - {mockItinerary.endDate.toLocaleDateString()}
                </span>
              </div>
              {isCurrentTrip && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active Trip
                </span>
              )}
            </div>
          </div>
          
          {isCurrentTrip && (
            <div className="text-right">
              <Button variant="outline" size="sm" icon={<Navigation size={16} />}>
                Get Directions
              </Button>
            </div>
          )}
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

      {/* Daily Itinerary */}
      {mockItinerary.days.map((day, dayIndex) => {
        const isToday = day.date.toDateString() === currentDate.toDateString();
        
        return (
          <div key={dayIndex} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Day Header */}
            <div className={`p-4 border-b border-gray-200 ${isToday ? 'bg-primary-50' : 'bg-gray-50'}`}>
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
                  className={`border border-gray-200 rounded-lg p-4 ${
                    activity.isCompleted ? 'bg-green-50 border-green-200' : 'bg-white'
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


