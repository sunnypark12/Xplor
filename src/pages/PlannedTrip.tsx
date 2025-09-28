import React, { useState, useEffect } from 'react';
import { useTravel } from '../contexts/TravelContext';
import { useNavigate } from 'react-router-dom';
import { Activity, Itinerary } from '../types';

type ParsedActivity = {
  id: string;
  time: string;
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
};

const PlannedTrip: React.FC = () => {
  const { currentItinerary, travelProfile } = useTravel();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [openActionIds, setOpenActionIds] = useState<Set<string>>(new Set());
  const [additionalInfoTab, setAdditionalInfoTab] = useState<'itinerary' | 'additional'>('itinerary');

  // Parse OpenAI response into display format with enhanced parsing
  const parseActivities = (itinerary: Itinerary): ParsedActivity[][] => {
    // First try to parse from raw AI response
    if (itinerary.aiResponse) {
      const parsedFromAI = parseItineraryFromAIResponse(itinerary.aiResponse);
      if (parsedFromAI.length > 0) {
        return parsedFromAI;
      }
    }

    // Fallback to existing structured data parsing
    if (!itinerary.days || itinerary.days.length === 0) {
      return [[]];
    }

    return itinerary.days.map((day, dayIndex) => {
      const activities: ParsedActivity[] = [];
      
      // Check if we have the new enhanced structure
      if (day.activities && Array.isArray(day.activities) && day.activities.length > 0) {
        // Handle enhanced structure from new parsing
        if (typeof day.activities[0] === 'object' && 'time' in day.activities[0]) {
          // New enhanced format
          day.activities.forEach((activity: any, index: number) => {
            activities.push({
              id: `activity-${dayIndex}-${index}`,
              time: activity.time || 'TBD',
              title: activity.title || activity.name || 'Activity',
              subtitle: activity.description?.substring(0, 80) + (activity.description?.length > 80 ? '...' : ''),
              description: activity.location || ''
            });
          });
        } else {
          // Legacy format - convert from original structure
          day.activities.forEach((activity: any, index: number) => {
            if (typeof activity === 'string') {
              // Handle string format
              activities.push({
                id: `activity-${dayIndex}-${index}`,
                time: extractTimeFromString(activity),
                title: cleanActivityTitle(activity),
                subtitle: '',
                description: ''
              });
            } else {
              // Handle object format
              activities.push({
                id: `activity-${dayIndex}-${index}`,
                time: formatTimeRange(activity.startTime, activity.endTime),
                title: activity.name,
                subtitle: activity.description?.substring(0, 80) + (activity.description?.length > 80 ? '...' : ''),
                description: activity.location?.name || ''
              });
            }
          });
        }
      }

      // Handle meals - check for enhanced structure
      if (day.meals && Array.isArray(day.meals) && day.meals.length > 0) {
        if (typeof day.meals[0] === 'object' && 'time' in day.meals[0]) {
          // New enhanced format
          day.meals.forEach((meal: any, index: number) => {
            activities.push({
              id: `meal-${dayIndex}-${index}`,
              time: meal.time || 'TBD',
              title: meal.name || 'Meal',
              subtitle: `${meal.cuisine || 'Local'} cuisine`,
              description: meal.location || ''
            });
          });
        } else {
          // Legacy format
          day.meals.forEach((meal: any, index: number) => {
            if (typeof meal === 'string') {
              activities.push({
                id: `meal-${dayIndex}-${index}`,
                time: extractTimeFromString(meal),
                title: cleanActivityTitle(meal),
                subtitle: 'Local cuisine',
                description: ''
              });
            } else {
              activities.push({
                id: `meal-${dayIndex}-${index}`,
                time: formatMealTime(meal.scheduledTime),
                title: meal.name,
                subtitle: `${meal.type?.charAt(0).toUpperCase() + meal.type?.slice(1)} - ${meal.cuisine} cuisine`,
                description: meal.location?.name || ''
              });
            }
          });
        }
      }

      // Sort by time
      activities.sort((a, b) => {
        const timeA = convertTimeToMinutes(a.time.split(' - ')[0]);
        const timeB = convertTimeToMinutes(b.time.split(' - ')[0]);
        return timeA - timeB;
      });

      return activities;
    });
  };

  // New function to parse itinerary directly from AI response
  const parseItineraryFromAIResponse = (aiResponse: string): ParsedActivity[][] => {
    const days: ParsedActivity[][] = [];
    
    // Split response into day sections
    const dayMatches = aiResponse.match(/\*\*Day \d+.*?\*\*/g);
    if (!dayMatches) return [];

    dayMatches.forEach((dayHeader, dayIndex) => {
      const dayActivities: ParsedActivity[] = [];
      
      // Find the content for this day
      const dayStartIndex = aiResponse.indexOf(dayHeader);
      const nextDayIndex = dayIndex < dayMatches.length - 1 
        ? aiResponse.indexOf(dayMatches[dayIndex + 1]) 
        : aiResponse.indexOf('###', dayStartIndex + dayHeader.length);
      
      const dayContent = nextDayIndex > dayStartIndex 
        ? aiResponse.slice(dayStartIndex, nextDayIndex)
        : aiResponse.slice(dayStartIndex);

      // Extract time periods: Morning, Lunch, Afternoon, Evening
      const timePatterns = [
        { pattern: /\*\*Morning\s*\((.*?)\)\*\*:\s*(.*?)(?=\*\*(?:Lunch|Afternoon|Evening)|$)/gs, defaultTime: '9:00 AM - 12:00 PM' },
        { pattern: /\*\*Lunch\s*\((.*?)\)\*\*:\s*(.*?)(?=\*\*(?:Morning|Afternoon|Evening)|$)/gs, defaultTime: '12:00 PM - 1:30 PM' },
        { pattern: /\*\*Afternoon\s*\((.*?)\)\*\*:\s*(.*?)(?=\*\*(?:Morning|Lunch|Evening)|$)/gs, defaultTime: '2:00 PM - 5:00 PM' },
        { pattern: /\*\*Evening\s*\((.*?)\)\*\*:\s*(.*?)(?=\*\*(?:Morning|Lunch|Afternoon)|$)/gs, defaultTime: '6:00 PM - 9:00 PM' }
      ];

      timePatterns.forEach((timePattern, timeIndex) => {
        // Use exec in a loop instead of matchAll for better compatibility
        const matches: RegExpExecArray[] = [];
        const regex = new RegExp(timePattern.pattern.source, timePattern.pattern.flags);
        let match;
        
        while ((match = regex.exec(dayContent)) !== null) {
          matches.push(match);
          // Prevent infinite loop if regex doesn't have global flag
          if (!regex.global) break;
        }
        
        matches.forEach((match, matchIndex) => {
          const timeRange = match[1] || timePattern.defaultTime;
          const content = match[2];
          
          if (content) {
            // Extract the main activity title (first line)
            const lines = content.trim().split('\n');
            const mainLine = lines[0].trim();
            
            // Clean up the title - remove markdown formatting and leading characters
            const title = mainLine
              .replace(/\*\*/g, '') // Remove all ** markdown formatting
              .replace(/^[-\*\+\s]+/, '') // Remove leading dashes, asterisks, and spaces
              .trim();
            
            // Extract subtitle and description from subsequent lines
            let subtitle = '';
            let description = '';
            
            for (let i = 1; i < lines.length; i++) {
              const line = lines[i].trim();
              if (line.startsWith('-') && line.includes(':')) {
                const cleanLine = line
                  .replace(/\*\*/g, '') // Remove all ** markdown formatting
                  .replace(/^[-\*\+\s]+/, '') // Remove leading dashes, asterisks, and spaces
                  .trim();
                if (cleanLine.toLowerCase().includes('budget') || 
                    cleanLine.toLowerCase().includes('specialty') ||
                    cleanLine.toLowerCase().includes('cuisine')) {
                  subtitle = cleanLine;
                } else if (cleanLine.toLowerCase().includes('duration') ||
                          cleanLine.toLowerCase().includes('transportation') ||
                          cleanLine.toLowerCase().includes('why it fits')) {
                  description = cleanLine;
                }
              }
            }

            dayActivities.push({
              id: `ai-${dayIndex}-${timeIndex}-${matchIndex}`,
              time: timeRange,
              title: title || 'Activity',
              subtitle: subtitle,
              description: description
            });
          }
        });
      });

      days.push(dayActivities);
    });

    return days;
  };

  // Helper functions for parsing
  const extractTimeFromString = (text: string): string => {
    const timeMatch = text.match(/(\d{1,2}:\d{2}\s*(?:AM|PM)?)/i);
    return timeMatch ? timeMatch[1] : 'TBD';
  };

  const cleanActivityTitle = (text: string): string => {
    // Remove markdown formatting, leading dashes, numbers, and clean up the title
    return text
      .replace(/\*\*/g, '') // Remove all ** markdown formatting
      .replace(/^[-\*\+\d\.\)\s]+/, '') // Remove leading dashes, asterisks, numbers, and spaces
      .replace(/\s+at\s+.*$/, '') // Remove " at [location]" suffixes
      .trim();
  };

  const convertTimeToMinutes = (time: string): number => {
    if (!time || time === 'TBD') return 0;
    
    const timeMatch = time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
    if (!timeMatch) return 0;
    
    let hours = parseInt(timeMatch[1]);
    const minutes = parseInt(timeMatch[2]);
    const period = timeMatch[3]?.toUpperCase();
    
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    
    return hours * 60 + minutes;
  };

  const formatTimeRange = (startTime: Date, endTime: Date): string => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    return `${start.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })} - ${end.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`;
  };

  const formatMealTime = (scheduledTime: Date): string => {
    const time = new Date(scheduledTime);
    const endTime = new Date(time.getTime() + 90 * 60 * 1000); // Add 90 minutes
    return formatTimeRange(time, endTime);
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getTravelStyleDescription = (profile: any): string => {
    if (!profile) return 'Explore new places and try unique experiences.';
    
    const { adventureLevel, explorationStyle, budgetLevel, pacePreference } = profile;
    
    if (adventureLevel === 'high' && explorationStyle === 'nature') {
      return 'Adventure seeker who loves outdoor experiences and nature exploration.';
    } else if (explorationStyle === 'foodie') {
      return 'Culinary explorer who seeks authentic local flavors and dining experiences.';
    } else if (explorationStyle === 'cultural' && pacePreference === 'slow') {
      return 'Cultural enthusiast who enjoys immersive experiences at a relaxed pace.';
    } else if (budgetLevel === 'luxury') {
      return 'Luxury traveler who appreciates premium experiences and comfort.';
    } else if (budgetLevel === 'budget' && adventureLevel === 'high') {
      return 'Budget backpacker who maximizes adventures while minimizing costs.';
    }
    
    return 'Versatile traveler who enjoys a mix of experiences and discoveries.';
  };

  const getGroupCategory = (travelers: number): string => {
    if (travelers === 1) return 'Solo';
    if (travelers === 2) return 'Couple';
    if (travelers <= 4) return 'Family';
    if (travelers <= 6) return 'Friends';
    return 'Group';
  };

  const parseMarkdownToText = (text: string): string => {
    if (!text) return '';
    
    // Remove markdown headers (###, ##, #)
    let cleaned = text.replace(/#{1,6}\s+/g, '');
    
    // Remove emoji headers like 🎯, 🗺️, 📅, 💰, 🎒, 🌟
    cleaned = cleaned.replace(/^[🎯🗺️📅💰🎒🌟]\s*.*$/gm, '');
    
    // Remove markdown bold/italic
    cleaned = cleaned.replace(/\*\*(.*?)\*\*/g, '$1');
    cleaned = cleaned.replace(/\*(.*?)\*/g, '$1');
    
    // Remove markdown lists and bullets
    cleaned = cleaned.replace(/^[\*\-\+•]\s+/gm, '');
    cleaned = cleaned.replace(/^\d+\.\s+/gm, '');
    
    // Remove section headers in all caps
    cleaned = cleaned.replace(/^[A-Z\s]{5,}:?\s*$/gm, '');
    
    // Remove Day headers like "**Day 1 - [Date] - Arrival...**"
    cleaned = cleaned.replace(/\*\*Day \d+.*?\*\*/g, '');
    
    // Remove time entries like "- **Morning (9:00-12:00)**:"
    cleaned = cleaned.replace(/^-\s*\*\*[A-Za-z]+\s*\([^)]+\)\*\*:?\s*$/gm, '');
    
    // Remove formatting for sub-bullets like "- Duration:", "- Why it fits:", etc.
    cleaned = cleaned.replace(/^-\s*\*\*[^*]+\*\*:?\s*/gm, '');
    
    // Clean up extra whitespace and newlines
    cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
    cleaned = cleaned.replace(/^\s*\n/gm, '');
    cleaned = cleaned.trim();
    
    return cleaned;
  };

  // Generate tabs based on trip duration with smart naming
  const generateTabs = (): string[] => {
    if (!currentItinerary) return ['Day 1'];
    
    return currentItinerary.days.map((day, index) => {
      return `Day ${index + 1}`;
    });
  };

  // Create a more accessible day selector
  const DaySelector = () => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <div className="relative">
        <button
          className="tab-pill tab-pill-active play-regular flex items-center gap-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {tabs[activeTab]} 
          <span className="text-xs">▼</span>
        </button>
        
        {isOpen && (
          <div className="absolute top-full left-0 mt-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 shadow-lg z-10 min-w-[120px]">
            {tabs.map((tab, index) => (
              <button
                key={tab}
                className={`w-full text-left px-4 py-2 text-white hover:bg-white/20 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                  index === activeTab ? 'bg-white/20' : ''
                }`}
                onClick={() => {
                  setActiveTab(index);
                  setIsOpen(false);
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  const tabs = generateTabs();
  const parsedDays = currentItinerary ? parseActivities(currentItinerary) : [[]];

  const handleRemove = (id: string) => {
    // Implementation for removing activities would go here
    console.info('Remove activity', id);
  };

  const handleSuggest = (id: string) => {
    // Implementation for suggesting alternatives would go here
    console.info('Suggest alternative for', id);
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

  // Add debugging and handle no itinerary case
  useEffect(() => {
    console.log('PlannedTrip - currentItinerary:', currentItinerary);
    console.log('PlannedTrip - travelProfile:', travelProfile);
  }, [currentItinerary, travelProfile]);

  // Don't redirect immediately, show a message instead
  if (!currentItinerary) {
    return (
      <div className="plannedtrip-page relative min-h-screen flex flex-col items-center justify-center" style={{ marginLeft: "250px", marginTop: "50px"}}>
        <div className="glass-card p-8 text-center">
          <h2 className="play-regular text-white text-2xl mb-4">No Trip Plan Found</h2>
          <p className="text-white/80 mb-6">
            You don't have an active trip plan yet. Create one to see your personalized itinerary here.
          </p>
          <button 
            className="glass-button play-regular px-6 py-3 rounded-lg text-white" style={{  marginTop: "20px", marginRight: "20px"}}
            onClick={() => navigate('/dashboard')}
          >
            Go to Dashboard
          </button>
          <button 
            className="glass-button play-regular px-6 py-3 rounded-lg text-white ml-4" style={{ marginTop: "20px", marginLeft: "20px"}}
            onClick={() => navigate('/home')}
          >
            Create New Trip
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="tripplanning-page relative min-h-screen flex flex-col">
      {/* Main content */}
      <div className="relative z-10 flex flex-1 px-20 gap-16" style={{ marginTop: '20px', marginLeft: "100px" }}>
        {/* Left Panel - Trip Details */}
        <div className="w-2/5 space-y-6">
          <div className="glass-card p-6" style={{ height: '81vh', marginTop: '30px', color: '#f1f1f1' }}>
            <div className="text-white">
              <h2 className="play-regular" style={{ fontSize: '1.8rem', marginLeft: '40px', marginTop: '30px', marginRight: '80px' }}>Trip Details:</h2>
            </div>
            <div className="mt-4 flex gap-6">
              <div className="w-40 h-28 bg-white/20 rounded-lg flex items-center justify-center">
                {/* Trip image placeholder */}
              </div>
              <div className="flex-1 grid grid-cols-2 text-white play-regular justify-end" style={{ marginLeft: '40px' }}>
                <div className="opacity-80 text-xs">Destination:</div>
                <div className="text-sm" style={{ fontSize: '20px' }}>{currentItinerary.tripInput.destination}</div>
                <div className="opacity-80 text-xs">Dates:</div>
                <div className="text-sm" style={{ fontSize: '20px' }}>
                  {formatDate(currentItinerary.tripInput.startDate)} - {formatDate(currentItinerary.tripInput.endDate)}
                </div>
                <div className="opacity-80 text-xs">Group Type:</div>
                <div className="text-sm" style={{ fontSize: '20px' }}>{getGroupCategory(currentItinerary.tripInput.travelers)}</div>
                <div className="opacity-80 text-xs">Budget:</div>
                <div className="text-sm" style={{ fontSize: '20px' }}>${currentItinerary.tripInput.budget?.toLocaleString() || 'N/A'}</div>
                <div className="opacity-80 text-xs">Occasion:</div>
                <div className="text-sm" style={{ fontSize: '20px' }}>{currentItinerary.tripInput.occasion || 'Leisure'}</div>
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
                onClick={() => navigate('/plan-trip')}
              >
                Edit My Trip
              </span>
            </div>

            {/* My Travel Style merged inside */}
            <div className="mt-8">
              <div className="text-white">
                <h3 className="play-regular mb-4" style={{ fontSize: '1.2rem', marginLeft: '40px' }}>My Travel Style:</h3>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1 text-white play-regular">
                  <div className="text-sm mb-1" style={{ marginLeft: '40px' }}>{travelProfile?.travelerType || 'Adventure Seeker'}</div>
                  <div className="mt-4">
                    <button 
                      className="glass-button play-regular px-6 py-2 rounded-lg text-white text-sm"  
                      style={{ fontSize: '1.2rem', marginLeft: '40px', width: '100%', height: '35px', marginTop: '60px' }}
                      onClick={() => navigate('/quiz')}
                    >
                      Retake Quiz
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Itinerary */}
        <div className="w-3/5">
          {/* Info Type Toggle */}
          <div className="flex items-center justify-start mb-4" style={{ marginTop: '30px', marginLeft: '50px' }}>
            <div className="flex space-x-4">
              <button
                className={`tab-pill ${additionalInfoTab === 'itinerary' ? 'tab-pill-active' : ''} play-regular`}
                onClick={() => setAdditionalInfoTab('itinerary')}
              >
                Itinerary
              </button>
              <button
                className={`tab-pill ${additionalInfoTab === 'additional' ? 'tab-pill-active' : ''} play-regular`}
                onClick={() => setAdditionalInfoTab('additional')}
              >
                Additional Info
              </button>
            </div>
          </div>

          {additionalInfoTab === 'itinerary' ? (
            <>
              {/* Day Selector */}
              <div className="flex items-center justify-start mb-6" style={{ marginLeft: '50px', marginBottom: '10px' }}>
                <DaySelector />
              </div>

              {/* Itinerary List */}
              <div className="glass-card p-4" style={{ height: '68vh', marginLeft: '50px', overflowY: 'auto' }}>
                <div className="flex flex-col space-y-4">
                  {parsedDays[activeTab]?.map((activity) => (
                    <div key={activity.id}>
                      <div className="glass-card justify-between items-center overflow-hidden p-4" style={{ cursor: 'pointer', marginTop: '8px'}} onClick={() => toggleActions(activity.id)}>
                        <div className="flex-l gap-4 items-start">
                          <div className="play-regular min-w-[140px] flex-shrink-0" style={{ marginLeft: '15px', fontSize: '0.8rem' }}>{activity.time}</div>
                          <div className="flex-1 min-w-0">
                            <div className="text-white play-regular break-words" style={{ marginLeft: '15px', fontSize: '1.2rem', lineHeight: '1.4' }}>{activity.title}</div>
                            {activity.subtitle && (
                              <div className="text-white/80 text-xs mt-1 break-words" style={{ marginLeft: '15px', lineHeight: '1.3' }}>{activity.subtitle}</div>
                            )}
                            {activity.description && (
                              <div className="text-white/80 text-xs mt-2 break-words" style={{ marginLeft: '15px', lineHeight: '1.3' }}>{activity.description}</div>
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
                  )) || []}
                </div>
              </div>
            </>
          ) : (
            /* Additional Info Panel */
              <div className="glass-card p-6" style={{ height: '78vh', marginLeft: '50px', overflowY: 'auto' }}>
              <div className="text-white space-y-4" style={{ marginLeft: '20px' }}>
                {/* AI Response Summary */}
                {currentItinerary.parsedData?.summary && (
                  <div>
                    <h3 className="play-regular text-lg mb-3">Trip Summary</h3>
                    <p className="text-white/80 text-sm leading-relaxed whitespace-pre-line break-words">
                      {parseMarkdownToText(currentItinerary.parsedData.summary)}
                    </p>
                  </div>
                )}

                {/* Budget Breakdown */}
                {currentItinerary.parsedData?.budget && (
                  <div>
                    <h3 className="play-regular text-lg mb-3">Budget Information</h3>
                    <div className="space-y-1">
                      {Object.entries(currentItinerary.parsedData.budget).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm">
                          <span className="text-white/80 capitalize break-words flex-1 mr-2">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                          <span className="text-white flex-shrink-0">${String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Travel Tips */}
                {currentItinerary.parsedData?.tips && currentItinerary.parsedData.tips.length > 0 && (
                  <div>
                    <h3 className="play-regular text-lg mb-3">Travel Tips</h3>
                    <ul className="space-y-1">
                      {currentItinerary.parsedData.tips.map((tip: string, index: number) => (
                        <li key={index} className="text-white/80 text-sm break-words leading-relaxed">
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Dynamic AI Recommendations */}
                <div>
                  <h3 className="play-regular text-lg mb-3">AI Recommendations</h3>
                  <div className="space-y-6">
                    
                    {/* Dynamic Trip Summary */}
                    {currentItinerary.parsedRecommendations?.summary && (
                      <div>
                        <h4 className="play-regular text-base mb-2 text-white">🎯 PERSONALIZED RECOMMENDATION SUMMARY</h4>
                        <p className="text-white/80 text-sm leading-relaxed whitespace-pre-line break-words">
                          {currentItinerary.parsedRecommendations.summary}
                        </p>
                      </div>
                    )}

                    {/* Dynamic Destination Analysis */}
                    {currentItinerary.parsedRecommendations?.destination_analysis && (
                      <div>
                        <h4 className="play-regular text-base mb-2 text-white">🗺️ DESTINATION ANALYSIS</h4>
                        <p className="text-white/80 text-sm leading-relaxed whitespace-pre-line break-words">
                          {currentItinerary.parsedRecommendations.destination_analysis}
                        </p>
                      </div>
                    )}

                    {/* Dynamic Budget Breakdown */}
                    {currentItinerary.parsedRecommendations?.budget_breakdown && Object.keys(currentItinerary.parsedRecommendations.budget_breakdown).length > 0 && (
                      <div>
                        <h4 className="play-regular text-base mb-2 text-white">💰 DETAILED BUDGET BREAKDOWN</h4>
                        <div className="bg-white/10 rounded-lg p-4 space-y-2">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            {Object.entries(currentItinerary.parsedRecommendations.budget_breakdown).map(([key, value]) => {
                              if (key === 'total_estimated') return null; // Handle total separately
                              return (
                                <div key={key} className="flex justify-between">
                                  <span className="text-white/80 capitalize">{key.replace(/_/g, ' ')}:</span>
                                  <span className="text-white">${String(value)}</span>
                                </div>
                              );
                            })}
                          </div>
                          {currentItinerary.parsedRecommendations.budget_breakdown.total_estimated && (
                            <div className="border-t border-white/20 pt-2 mt-3">
                              <div className="flex justify-between font-medium">
                                <span className="text-white">Total Estimated:</span>
                                <span className="text-white">${currentItinerary.parsedRecommendations.budget_breakdown.total_estimated}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Dynamic Practical Guide */}
                    {currentItinerary.parsedRecommendations?.practical_guide && (
                      <div>
                        <h4 className="play-regular text-base mb-3 text-white">🎒 PRACTICAL GUIDE</h4>
                        
                        <div className="space-y-4">
                          {currentItinerary.parsedRecommendations.practical_guide.packing_essentials && currentItinerary.parsedRecommendations.practical_guide.packing_essentials.length > 0 && (
                            <div>
                              <h5 className="text-white font-medium mb-2">Packing Essentials</h5>
                              <ul className="text-white/80 text-sm space-y-1 ml-4">
                                {currentItinerary.parsedRecommendations.practical_guide.packing_essentials.map((item: string, index: number) => (
                                  <li key={index}>• {item}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {currentItinerary.parsedRecommendations.practical_guide.cultural_etiquette && currentItinerary.parsedRecommendations.practical_guide.cultural_etiquette.length > 0 && (
                            <div>
                              <h5 className="text-white font-medium mb-2">Cultural Etiquette</h5>
                              <ul className="text-white/80 text-sm space-y-1 ml-4">
                                {currentItinerary.parsedRecommendations.practical_guide.cultural_etiquette.map((item: string, index: number) => (
                                  <li key={index}>• {item}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {currentItinerary.parsedRecommendations.practical_guide.language_basics && currentItinerary.parsedRecommendations.practical_guide.language_basics.length > 0 && (
                            <div>
                              <h5 className="text-white font-medium mb-2">Language Basics</h5>
                              <ul className="text-white/80 text-sm space-y-1 ml-4">
                                {currentItinerary.parsedRecommendations.practical_guide.language_basics.map((item: string, index: number) => (
                                  <li key={index}>• {item}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {currentItinerary.parsedRecommendations.practical_guide.safety_considerations && currentItinerary.parsedRecommendations.practical_guide.safety_considerations.length > 0 && (
                            <div>
                              <h5 className="text-white font-medium mb-2">Safety Considerations</h5>
                              <ul className="text-white/80 text-sm space-y-1 ml-4">
                                {currentItinerary.parsedRecommendations.practical_guide.safety_considerations.map((item: string, index: number) => (
                                  <li key={index}>• {item}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {currentItinerary.parsedRecommendations.practical_guide.local_transportation && currentItinerary.parsedRecommendations.practical_guide.local_transportation.length > 0 && (
                            <div>
                              <h5 className="text-white font-medium mb-2">Local Transportation</h5>
                              <ul className="text-white/80 text-sm space-y-1 ml-4">
                                {currentItinerary.parsedRecommendations.practical_guide.local_transportation.map((item: string, index: number) => (
                                  <li key={index}>• {item}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {currentItinerary.parsedRecommendations.practical_guide.emergency_contacts && currentItinerary.parsedRecommendations.practical_guide.emergency_contacts.length > 0 && (
                            <div>
                              <h5 className="text-white font-medium mb-2">Emergency Contacts</h5>
                              <ul className="text-white/80 text-sm space-y-1 ml-4">
                                {currentItinerary.parsedRecommendations.practical_guide.emergency_contacts.map((item: string, index: number) => (
                                  <li key={index}>• {item}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Dynamic Personalization Touches */}
                    {currentItinerary.parsedRecommendations?.personalization_touches && (
                      <div>
                        <h4 className="play-regular text-base mb-3 text-white">🌟 PERSONALIZATION TOUCHES</h4>
                        
                        <div className="space-y-4">
                          {currentItinerary.parsedRecommendations.personalization_touches.hidden_gems && (
                            <div>
                              <h5 className="text-white font-medium mb-2">Hidden Gems</h5>
                              <p className="text-white/80 text-sm whitespace-pre-line break-words">
                                {currentItinerary.parsedRecommendations.personalization_touches.hidden_gems}
                              </p>
                            </div>
                          )}

                          {currentItinerary.parsedRecommendations.personalization_touches.local_connections && (
                            <div>
                              <h5 className="text-white font-medium mb-2">Local Connections</h5>
                              <p className="text-white/80 text-sm whitespace-pre-line break-words">
                                {currentItinerary.parsedRecommendations.personalization_touches.local_connections}
                              </p>
                            </div>
                          )}

                          {currentItinerary.parsedRecommendations.personalization_touches.seasonal_specials && (
                            <div>
                              <h5 className="text-white font-medium mb-2">Seasonal Specials</h5>
                              <p className="text-white/80 text-sm whitespace-pre-line break-words">
                                {currentItinerary.parsedRecommendations.personalization_touches.seasonal_specials}
                              </p>
                            </div>
                          )}

                          {currentItinerary.parsedRecommendations.personalization_touches.future_trip_seeds && (
                            <div>
                              <h5 className="text-white font-medium mb-2">Future Trip Seeds</h5>
                              <p className="text-white/80 text-sm whitespace-pre-line break-words">
                                {currentItinerary.parsedRecommendations.personalization_touches.future_trip_seeds}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Fallback: Show raw AI response if structured data is not available */}
                    {(!currentItinerary.parsedRecommendations || Object.keys(currentItinerary.parsedRecommendations).length === 0) && currentItinerary.aiResponse && (
                      <div>
                        <h4 className="play-regular text-base mb-3 text-white">Raw AI Response</h4>
                        <div className="bg-white/10 rounded-lg p-3 text-white/70 text-xs max-h-80 overflow-y-auto">
                          <pre className="whitespace-pre-wrap font-sans break-words">
                            {currentItinerary.aiResponse}
                          </pre>
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlannedTrip;
