/**
 * API service for communicating with the AI Travel Agent backend
 */
import axios, { AxiosResponse } from 'axios';
import { TripInput, TravelProfile } from '../types';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 150000, // 2 minutes timeout for AI operations (increased for complex itineraries)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    
    // Handle timeout errors specifically
    if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
      console.error('Request timed out. The AI is still processing your request.');
      error.message = 'The AI is taking longer than usual to create your itinerary. Please try again in a moment.';
    }
    
    // Handle network errors
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      console.error('Network error. Check if the backend is running.');
      error.message = 'Unable to connect to the server. Please make sure the backend is running on port 8000.';
    }
    
    return Promise.reject(error);
  }
);

// API Response Types
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

interface TravelRecommendation {
  user_id: string;
  query: string;
  recommendation: string;
  timestamp: string;
  model_used: string;
  data_sources_used: string[];
  personalization_factors: {
    travel_history_count: number;
    preferences_available: boolean;
    experience_level: string;
  };
}

interface ItineraryResponse {
  user_id: string;
  query: string;
  recommendation: string;
  timestamp: string;
  model_used: string;
  data_sources_used: string[];
}

// API Service Class
export class TravelApiService {
  /**
   * Test API connection
   */
  static async healthCheck(): Promise<boolean> {
    try {
      const response = await api.get('/');
      return response.data.status === 'healthy';
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }

  /**
   * Get personalized travel recommendation
   */
  static async getTravelRecommendation(
    userId: string,
    query: string,
    context?: any
  ): Promise<TravelRecommendation> {
    try {
      const response: AxiosResponse<ApiResponse<TravelRecommendation>> = await api.post(
        '/api/travel/ask',
        {
          user_id: userId,
          query,
          context: context || {}
        }
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || 'Failed to get recommendation');
      }

      return response.data.data;
    } catch (error: any) {
      console.error('Error getting travel recommendation:', error);
      throw new Error(error.response?.data?.error || error.message || 'Failed to get recommendation');
    }
  }

  /**
   * Create detailed itinerary with retry mechanism
   */
  static async createItinerary(
    destination: string,
    duration: number,
    budget: number,
    userId: string,
    preferences: any = {},
    retryCount = 0
  ): Promise<ItineraryResponse> {
    const maxRetries = 2;
    
    try {
      const response: AxiosResponse<ApiResponse<ItineraryResponse>> = await api.post(
        '/api/itinerary/create',
        {
          destination,
          duration,
          budget,
          user_id: userId,
          preferences
        }
      );

      console.log('Raw API response:', response.data);

      if (!response.data.success || !response.data.data) {
        console.error('API Response failed:', response.data);
        throw new Error(response.data.error || 'Failed to create itinerary');
      }

      console.log('API data returned:', response.data.data);
      return response.data.data;
    } catch (error: any) {
      console.error(`Error creating itinerary (attempt ${retryCount + 1}):`, error);
      
      // Retry on timeout or network errors
      if (retryCount < maxRetries && 
          (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK')) {
        console.log(`Retrying request... (${retryCount + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retry
        return this.createItinerary(destination, duration, budget, userId, preferences, retryCount + 1);
      }
      
      throw new Error(error.response?.data?.error || error.message || 'Failed to create itinerary');
    }
  }

  /**
   * Get destination recommendations
   */
  static async getDestinationRecommendations(
    userId: string,
    preferences: any = {},
    budgetRange: [number, number] = [0, 10000],
    topK: number = 10
  ): Promise<any[]> {
    try {
      const response: AxiosResponse<ApiResponse<any>> = await api.post(
        '/api/recommendations',
        {
          user_id: userId,
          destination_type: 'any',
          budget_min: budgetRange[0],
          budget_max: budgetRange[1],
          preferences,
          recommendation_type: 'hybrid',
          top_k: topK
        }
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || 'Failed to get recommendations');
      }

      return response.data.data.recommendations || [];
    } catch (error: any) {
      console.error('Error getting destination recommendations:', error);
      throw new Error(error.response?.data?.error || error.message || 'Failed to get recommendations');
    }
  }

  /**
   * Get popular destinations
   */
  static async getPopularDestinations(): Promise<any[]> {
    try {
      const response: AxiosResponse<ApiResponse<any>> = await api.get(
        '/api/destinations/popular'
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || 'Failed to get popular destinations');
      }

      return response.data.data.popular_destinations || [];
    } catch (error: any) {
      console.error('Error getting popular destinations:', error);
      throw new Error(error.response?.data?.error || error.message || 'Failed to get popular destinations');
    }
  }

  /**
   * Submit user feedback
   */
  static async submitFeedback(
    userId: string,
    destinationId: string,
    rating: number,
    feedback: string
  ): Promise<boolean> {
    try {
      const response: AxiosResponse<ApiResponse<any>> = await api.post(
        '/api/feedback',
        {
          user_id: userId,
          destination_id: destinationId,
          rating,
          feedback
        }
      );

      return response.data.success;
    } catch (error: any) {
      console.error('Error submitting feedback:', error);
      return false;
    }
  }

  /**
   * Get datasets status
   */
  static async getDatasetsStatus(): Promise<any> {
    try {
      const response: AxiosResponse<ApiResponse<any>> = await api.get(
        '/api/datasets/status'
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || 'Failed to get datasets status');
      }

      return response.data.data;
    } catch (error: any) {
      console.error('Error getting datasets status:', error);
      throw new Error(error.response?.data?.error || error.message || 'Failed to get datasets status');
    }
  }

  /**
   * Build comprehensive trip query from TripInput and TravelProfile with enhanced prompt engineering
   */
  static buildTripQuery(tripInput: TripInput, travelProfile?: TravelProfile | null): string {
    const duration = Math.ceil((tripInput.endDate.getTime() - tripInput.startDate.getTime()) / (1000 * 60 * 60 * 24));
    const groupCategory = this.getGroupCategory(tripInput.travelers);
    
    let query = `STRUCTURED TRAVEL ITINERARY REQUEST

TRIP DETAILS:
- Destination: ${tripInput.destination}
- Duration: ${duration} days (${tripInput.startDate.toLocaleDateString()} to ${tripInput.endDate.toLocaleDateString()})
- Group: ${groupCategory} (${tripInput.travelers} traveler${tripInput.travelers > 1 ? 's' : ''})
- Budget: ${tripInput.budget ? `$${tripInput.budget} total` : 'Flexible'}
- Occasion: ${tripInput.occasion || 'Leisure travel'}`;
    
    if (tripInput.accommodation) {
      query += `\n- Accommodation: ${tripInput.accommodation}`;
    }
    
    if (tripInput.specialInterests.length > 0) {
      query += `\n- Interests: ${tripInput.specialInterests.join(', ')}`;
    }
    
    if (tripInput.constraints.length > 0) {
      query += `\n- Constraints: ${tripInput.constraints.map(c => `${c.type} (${c.description})`).join(', ')}`;
    }
    
    if (travelProfile) {
      query += `\n\nTRAVEL PROFILE:
- Adventure Level: ${travelProfile.adventureLevel}
- Exploration Style: ${travelProfile.explorationStyle}
- Budget Preference: ${travelProfile.budgetLevel}
- Travel Pace: ${travelProfile.pacePreference}
- Group Dynamic: ${travelProfile.groupDynamic}`;
      
      if (travelProfile.travelerType) {
        query += `\n- Traveler Type: ${travelProfile.travelerType}`;
      }
    }
    
    query += `\n\nOUTPUT FORMAT REQUIREMENTS:
Please provide a comprehensive itinerary with the following EXACT structure:

SUMMARY:
[Provide a 2-3 sentence overview of the trip without markdown formatting]

DAY-BY-DAY ITINERARY:
For each day, provide:

DAY X (Date):
MORNING (8:00 AM - 12:00 PM):
- [Time] [Activity Name] at [Location] - [Brief description]

AFTERNOON (12:00 PM - 6:00 PM):
- [Time] [Activity Name] at [Location] - [Brief description]
- [Time] Lunch at [Restaurant Name] - [Cuisine type, brief description]

EVENING (6:00 PM - 10:00 PM):
- [Time] [Activity Name] at [Location] - [Brief description]
- [Time] Dinner at [Restaurant Name] - [Cuisine type, brief description]

BUDGET BREAKDOWN:
- Accommodation: $[amount]
- Meals: $[amount]
- Activities: $[amount]
- Transportation: $[amount]
- Total: $[amount]

TRAVEL TIPS:
- [Practical tip 1]
- [Practical tip 2]
- [Practical tip 3]

IMPORTANT: 
- Use specific times (e.g., "9:00 AM - 11:00 AM")
- Include actual restaurant/location names when possible
- Be detailed but concise
- Consider travel time between locations
- Match recommendations to the travel profile and budget`;
    
    return query;
  }

  /**
   * Helper function to convert traveler count to category
   */
  private static getGroupCategory(travelers: number): string {
    if (travelers === 1) return 'Solo';
    if (travelers === 2) return 'Couple';
    if (travelers <= 4) return 'Family';
    if (travelers <= 6) return 'Friends';
    return 'Group';
  }

  /**
   * Parse AI response into structured itinerary data
   */
  static parseItineraryResponse(aiResponse: string): any {
    try {
      const lines = aiResponse.split('\n');
      const parsedData = {
        summary: '',
        days: [] as Array<{
          day: number;
          date: string;
          activities: Array<{
            time: string;
            title: string;
            location: string;
            description: string;
            type: 'activity' | 'meal' | 'transport';
          }>;
          meals: Array<{
            time: string;
            name: string;
            location: string;
            cuisine: string;
          }>;
          notes: string;
        }>,
        budget: {} as any,
        tips: [] as string[]
      };
      
      let currentSection = '';
      let currentDay: any = null;
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Detect sections - handle both new structured format and legacy formats
        if (line.toUpperCase().includes('SUMMARY') || line.includes('🎯') || 
            line.toUpperCase().includes('PERSONALIZED RECOMMENDATION')) {
          currentSection = 'summary';
          continue;
        } else if (line.match(/^\*?\*?Day \d+/i) || line.includes('📅') || 
                   line.toUpperCase().includes('DETAILED ITINERARY')) {
          // Handle markdown day headers like "**Day 1 - [Date] - Title**"
          const dayMatch = line.match(/Day (\d+)/i);
          if (dayMatch) {
            // Save previous day
            if (currentDay) {
              parsedData.days.push(currentDay);
            }
            
            // Start new day
            currentDay = {
              day: parseInt(dayMatch[1]),
              date: line.replace(/\*\*/g, '').trim(),
              activities: [],
              meals: [],
              notes: ''
            };
            currentSection = 'day';
          }
          continue;
        } else if (line.toUpperCase().includes('BUDGET') || line.includes('💰')) {
          currentSection = 'budget';
          continue;
        } else if (line.toUpperCase().includes('TIPS') || line.toUpperCase().includes('PRACTICAL') || line.includes('🎒')) {
          currentSection = 'tips';
          continue;
        }
        
        // Parse content based on current section
        if (currentSection === 'summary' && line && !line.includes(':') && !line.startsWith('#') && 
            !line.includes('🎯') && !line.toUpperCase().includes('DESTINATION ANALYSIS')) {
          parsedData.summary += (parsedData.summary ? ' ' : '') + line;
        } else if (currentSection === 'day' && currentDay && line) {
          // Parse markdown-formatted day activities
          // Handle time periods like "- **Morning (9:00-12:00)**: Activity"
          const timePeriodMatch = line.match(/^-?\s*\*?\*?([A-Za-z]+)\s*\(([^)]+)\)\*?\*?:?\s*(.*)$/i);
          if (timePeriodMatch) {
            const period = timePeriodMatch[1];
            const timeRange = timePeriodMatch[2];
            const activityDescription = timePeriodMatch[3];
            
            if (activityDescription.trim()) {
              const activity = {
                time: timeRange,
                title: activityDescription.trim(),
                location: '',
                description: '',
                type: this.categorizeActivity(activityDescription) as 'activity' | 'meal' | 'transport'
              };
              
              currentDay.activities.push(activity);
              
              if (activity.type === 'meal') {
                currentDay.meals.push({
                  time: timeRange,
                  name: activity.title,
                  location: '',
                  cuisine: this.extractCuisine(activity.title)
                });
              }
            }
            continue;
          }
          
          // Handle sub-bullet points with details like "  - Duration: 3 hours"
          const subDetailMatch = line.match(/^\s*-\s*\*?\*?([^*:]+)\*?\*?:\s*(.+)$/);
          if (subDetailMatch && currentDay.activities.length > 0) {
            const detailType = subDetailMatch[1].toLowerCase().trim();
            const detailValue = subDetailMatch[2].trim();
            
            const lastActivity = currentDay.activities[currentDay.activities.length - 1];
            if (detailType.includes('location') || detailType.includes('where')) {
              lastActivity.location = detailValue;
            } else if (detailType.includes('description') || detailType.includes('specialty') || detailType.includes('experience')) {
              lastActivity.description = detailValue;
            }
            continue;
          }
          
          // Enhanced time-based parsing for other formats
          const timeMatch = line.match(/^-?\s*(\d{1,2}:\d{2}\s*(?:AM|PM)?(?:\s*-\s*\d{1,2}:\d{2}\s*(?:AM|PM)?)?)/i);
          if (timeMatch) {
            const timeStr = timeMatch[1];
            const restOfLine = line.replace(timeMatch[0], '').trim();
            
            if (restOfLine) {
              const activity = {
                time: timeStr,
                title: restOfLine,
                location: '',
                description: '',
                type: this.categorizeActivity(restOfLine) as 'activity' | 'meal' | 'transport'
              };
              currentDay.activities.push(activity);
              
              if (activity.type === 'meal') {
                currentDay.meals.push({
                  time: timeStr,
                  name: activity.title,
                  location: '',
                  cuisine: this.extractCuisine(restOfLine)
                });
              }
            }
          } else if (line.startsWith('-') && line.length > 3) {
            // General bullet point parsing
            const content = line.replace(/^-\s*/, '').trim();
            if (content && !content.match(/^(Duration|Why|Pro tip|Experience|Transportation)/i)) {
              const activity = {
                time: '',
                title: content,
                location: '',
                description: '',
                type: this.categorizeActivity(content) as 'activity' | 'meal' | 'transport'
              };
              currentDay.activities.push(activity);
              
              if (activity.type === 'meal') {
                currentDay.meals.push({
                  time: '',
                  name: activity.title,
                  location: '',
                  cuisine: this.extractCuisine(content)
                });
              }
            }
          }
        } else if (currentSection === 'budget' && line.includes('$')) {
          // Parse budget items - handle both formats
          const budgetMatch = line.match(/^-?\s*\*?\*?(.+?)\*?\*?:\s*\$(\d+(?:,\d{3})*(?:\.\d{2})?)/i);
          if (budgetMatch) {
            const category = budgetMatch[1].trim().toLowerCase().replace(/\*/g, '');
            const amount = budgetMatch[2].replace(/,/g, '');
            parsedData.budget[category] = parseFloat(amount);
          }
        } else if (currentSection === 'tips' && line && (line.startsWith('-') || line.startsWith('•'))) {
          const tip = line.replace(/^[-•]\s*/, '').replace(/\*\*/g, '').trim();
          if (tip) {
            parsedData.tips.push(tip);
          }
        }
      }
      
      // Add the last day if exists
      if (currentDay) {
        parsedData.days.push(currentDay);
      }
      
      return parsedData;
    } catch (error) {
      console.error('Error parsing itinerary response:', error);
      return {
        summary: this.extractSummaryFallback(aiResponse),
        days: this.extractDaysFallback(aiResponse),
        budget: {},
        tips: this.extractTipsFallback(aiResponse)
      };
    }
  }

  /**
   * Helper methods for enhanced parsing
   */
  private static categorizeActivity(title: string): string {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('lunch') || titleLower.includes('dinner') || titleLower.includes('breakfast') || 
        titleLower.includes('meal') || titleLower.includes('restaurant') || titleLower.includes('cafe')) {
      return 'meal';
    }
    if (titleLower.includes('transport') || titleLower.includes('taxi') || titleLower.includes('subway') || 
        titleLower.includes('bus') || titleLower.includes('train') || titleLower.includes('flight')) {
      return 'transport';
    }
    return 'activity';
  }

  private static extractCuisine(text: string): string {
    const cuisines = ['italian', 'french', 'chinese', 'japanese', 'thai', 'indian', 'mexican', 'korean', 'american', 'local'];
    const textLower = text.toLowerCase();
    for (const cuisine of cuisines) {
      if (textLower.includes(cuisine)) {
        return cuisine.charAt(0).toUpperCase() + cuisine.slice(1);
      }
    }
    return 'Local';
  }

  private static extractTime(text: string): string {
    const timeMatch = text.match(/(\d{1,2}:\d{2}\s*(?:AM|PM)?)/i);
    return timeMatch ? timeMatch[1] : '';
  }

  private static extractSummaryFallback(text: string): string {
    const summaryMatch = text.match(/SUMMARY:?\s*\n?(.*?)(\n\n|\nDAY|$)/i);
    return summaryMatch ? summaryMatch[1].trim() : text.substring(0, 200) + '...';
  }

  private static extractDaysFallback(text: string): any[] {
    const days: any[] = [];
    // Split by DAY keywords to extract individual days
    const dayRegex = /DAY \d+/gi;
    const dayMatches = text.split(dayRegex);
    
    if (dayMatches.length > 1) {
      // Skip first match (before first DAY) and process the rest
      dayMatches.slice(1).forEach((dayText, index) => {
        days.push({
          day: index + 1,
          date: `Day ${index + 1}`,
          activities: [],
          meals: [],
          notes: dayText.trim()
        });
      });
    }
    return days;
  }

  private static extractTipsFallback(text: string): string[] {
    const tipsMatch = text.match(/TRAVEL TIPS:?\s*\n?(.*?)$/i);
    if (tipsMatch) {
      return tipsMatch[1].split('\n')
        .filter(line => line.trim().startsWith('-'))
        .map(line => line.replace(/^-\s*/, '').trim())
        .filter(line => line.length > 0);
    }
    return [];
  }
}

export default TravelApiService;

