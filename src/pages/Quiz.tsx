import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Check, ArrowLeft, ArrowRight } from 'lucide-react';
import { useTravel } from '../contexts/TravelContext';
import { TravelProfile, QuizQuestion, QuizResponse } from '../types';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';

// Traveler personality types
type TravelerType = 
  | 'Budget Backpacker'
  | 'Hidden Gem Hunter'
  | 'Culinary Explorer'
  | 'Thrill Seeker'
  | 'Cultural Explorer'
  | 'Luxe Unwinder'
  | 'Social Connector'
  | 'Family Traveler';

interface TravelerPersonality {
  type: TravelerType;
  description: string;
  icon: string;
}

const Quiz: React.FC = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<QuizResponse[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [travelerType, setTravelerType] = useState<TravelerPersonality | null>(null);

  // Debug: Log that Quiz component is rendering
  console.log('Quiz component is rendering');

  // Try to get saveTravelProfile with error handling
  let saveTravelProfile: (profile: TravelProfile) => Promise<void>;
  try {
    const travelContext = useTravel();
    saveTravelProfile = travelContext.saveTravelProfile;
  } catch (error) {
    console.error('Error accessing TravelContext:', error);
    saveTravelProfile = async (profile: TravelProfile) => {
      console.log('Mock save travel profile:', profile);
      // For now, just navigate to home
      navigate('/home');
    };
  }

  // Traveler personalities with descriptions
  const travelerPersonalities: Record<TravelerType, TravelerPersonality> = {
    'Budget Backpacker': {
      type: 'Budget Backpacker',
      description: 'Stretch every dollar, chase every experience. The world is your hostel.',
      icon: '🎒'
    },
    'Hidden Gem Hunter': {
      type: 'Hidden Gem Hunter',
      description: 'Skip the tourist trail, find what\'s hidden. Every side street holds a story.',
      icon: '🔍'
    },
    'Culinary Explorer': {
      type: 'Culinary Explorer',
      description: 'Travel through flavors, savor every bite. Food is your map.',
      icon: '🍜'
    },
    'Thrill Seeker': {
      type: 'Thrill Seeker',
      description: 'Adrenaline first, plan second. Every trip is a new rush.',
      icon: '🏔️'
    },
    'Cultural Explorer': {
      type: 'Cultural Explorer',
      description: 'History, art, and tradition guide you. Meaning is the real souvenir.',
      icon: '🏛️'
    },
    'Luxe Unwinder': {
      type: 'Luxe Unwinder',
      description: 'Five stars, no stress. Comfort is the destination.',
      icon: '💎'
    },
    'Social Connector': {
      type: 'Social Connector',
      description: 'Trips are louder with friends. Your landmark.',
      icon: '👥'
    },
    'Family Traveler': {
      type: 'Family Traveler',
      description: 'Every plan fits all ages. Smiles are the best keepsake.',
      icon: '👨‍👩‍👧‍👦'
    }
  };

  // Quiz questions data
  const questions: QuizQuestion[] = [
    {
      id: 'q1_arrival',
      question: "You've just landed and dropped your bags. What's your first move?",
      type: 'single',
      category: 'arrival',
      backgroundImage: '/Q1.png',
      options: [
        {
          id: 'cafe_quiet',
          text: 'Wander to a café or quiet corner to soak it all in.',
          value: 'A',
          personalities: ['Hidden Gem Hunter', 'Family Traveler']
        },
        {
          id: 'landmark_museum',
          text: 'Head straight to a landmark or museum.',
          value: 'B',
          personalities: ['Cultural Explorer']
        },
        {
          id: 'food_market',
          text: 'Find the nearest food street or market.',
          value: 'C',
          personalities: ['Culinary Explorer']
        },
        {
          id: 'adventure_hunt',
          text: 'Hunt down a spontaneous adventure.',
          value: 'D',
          personalities: ['Thrill Seeker', 'Budget Backpacker']
        }
      ]
    },
    {
      id: 'q2_midday',
      question: "The afternoon is open. Where are you going?",
      type: 'single',
      category: 'midday',
      backgroundImage: '/Q2.png',
      options: [
        {
          id: 'workshop_heritage',
          text: 'A local workshop, festival, or heritage street.',
          value: 'A',
          personalities: ['Cultural Explorer']
        },
        {
          id: 'outdoor_adventure',
          text: 'An outdoor adventure: hike, kayak, surf, or cycle.',
          value: 'B',
          personalities: ['Thrill Seeker', 'Budget Backpacker']
        },
        {
          id: 'market_food',
          text: 'A bustling market or food crawl.',
          value: 'C',
          personalities: ['Culinary Explorer']
        },
        {
          id: 'spa_relax',
          text: 'A spa, rooftop pool, or beach lounger.',
          value: 'D',
          personalities: ['Luxe Unwinder']
        }
      ]
    },
    {
      id: 'q3_curveball',
      question: "Your planned stop is unexpectedly closed. What do you do?",
      type: 'single',
      category: 'curveball',
      backgroundImage: '/Q3.png',
      options: [
        {
          id: 'calm_settle',
          text: 'Settle into something calm: bookstore, tea, or stroll.',
          value: 'A',
          personalities: ['Hidden Gem Hunter', 'Family Traveler']
        },
        {
          id: 'local_gem',
          text: 'Ask a local for a hidden gem and pivot.',
          value: 'B',
          personalities: ['Hidden Gem Hunter']
        },
        {
          id: 'upgrade_luxe',
          text: 'Upgrade: private guide, luxe meal, or spa instead.',
          value: 'C',
          personalities: ['Luxe Unwinder']
        },
        {
          id: 'thrill_improvise',
          text: 'Find another thrill, improvise with an adventure.',
          value: 'D',
          personalities: ['Thrill Seeker', 'Social Connector']
        }
      ]
    },
    {
      id: 'q4_golden_hour',
      question: "It's sunset. What's your scene?",
      type: 'single',
      category: 'golden_hour',
      backgroundImage: '/Q4.png',
      options: [
        {
          id: 'picnic_quiet',
          text: 'Picnic in a quiet park or beach.',
          value: 'A',
          personalities: ['Family Traveler', 'Hidden Gem Hunter']
        },
        {
          id: 'rooftop_panorama',
          text: 'Rooftop or city panorama spot.',
          value: 'B',
          personalities: ['Social Connector']
        },
        {
          id: 'sunset_adventure',
          text: 'Sunset hike, cliff, or boat ride.',
          value: 'C',
          personalities: ['Thrill Seeker', 'Budget Backpacker']
        },
        {
          id: 'dinner_renowned',
          text: 'Dinner at a renowned spot timed for views.',
          value: 'D',
          personalities: ['Culinary Explorer', 'Luxe Unwinder']
        }
      ]
    },
    {
      id: 'q5_big_ticket',
      question: "You can only lock one thing for tomorrow:",
      type: 'single',
      category: 'big_ticket',
      backgroundImage: '/Q5.png',
      options: [
        {
          id: 'cultural_historic',
          text: 'A guided cultural or historic experience.',
          value: 'A',
          personalities: ['Cultural Explorer']
        },
        {
          id: 'cooking_food',
          text: 'A cooking class, winery, or food market.',
          value: 'B',
          personalities: ['Culinary Explorer']
        },
        {
          id: 'adrenaline_rush',
          text: 'An adrenaline rush: surf, trek, canyon, climb.',
          value: 'C',
          personalities: ['Thrill Seeker', 'Budget Backpacker']
        },
        {
          id: 'comfort_luxury',
          text: 'A day of full comfort: resort, spa, or leisure.',
          value: 'D',
          personalities: ['Luxe Unwinder']
        }
      ]
    }
  ];

  // Calculate traveler personality based on responses
  const calculatePersonality = (): TravelerPersonality => {
    const scores: Record<TravelerType, number> = {
      'Budget Backpacker': 0,
      'Hidden Gem Hunter': 0,
      'Culinary Explorer': 0,
      'Thrill Seeker': 0,
      'Cultural Explorer': 0,
      'Luxe Unwinder': 0,
      'Social Connector': 0,
      'Family Traveler': 0
    };

    // Score each response
    responses.forEach(response => {
      const question = questions.find(q => q.id === response.questionId);
      if (question) {
        const selectedOption = question.options.find(opt => opt.id === response.selectedOptions[0]);
        if (selectedOption && 'personalities' in selectedOption && selectedOption.personalities) {
          selectedOption.personalities.forEach(personality => {
            scores[personality as TravelerType]++;
          });
        }
      }
    });

    // Find the highest scoring personality
    let maxScore = 0;
    let winningPersonality: TravelerType = 'Hidden Gem Hunter';
    
    Object.entries(scores).forEach(([personality, score]) => {
      if (score > maxScore) {
        maxScore = score;
        winningPersonality = personality as TravelerType;
      }
    });

    // Tiebreaker: use Q1 response if tied
    if (Object.values(scores).filter(score => score === maxScore).length > 1) {
      const q1Response = responses.find(r => r.questionId === 'q1_arrival');
      if (q1Response) {
        const q1Question = questions.find(q => q.id === 'q1_arrival');
        const q1Option = q1Question?.options.find(opt => opt.id === q1Response.selectedOptions[0]);
        if (q1Option && 'personalities' in q1Option && q1Option.personalities && q1Option.personalities.length > 0) {
          // Use the first personality from Q1 as tiebreaker
          winningPersonality = q1Option.personalities[0] as TravelerType;
        }
      }
    }

    return travelerPersonalities[winningPersonality];
  };

  const handleOptionSelect = (questionId: string, optionId: string) => {
    const existingResponseIndex = responses.findIndex(r => r.questionId === questionId);
    const newResponse: QuizResponse = {
      questionId,
      selectedOptions: [optionId]
    };

    if (existingResponseIndex >= 0) {
      const newResponses = [...responses];
      newResponses[existingResponseIndex] = newResponse;
      setResponses(newResponses);
    } else {
      setResponses([...responses, newResponse]);
    }
  };

  const getSelectedOption = (questionId: string) => {
    const response = responses.find(r => r.questionId === questionId);
    return response?.selectedOptions[0] || null;
  };

  const canGoNext = () => {
    return getSelectedOption(questions[currentQuestion].id) !== null;
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      // Calculate personality
      const personality = calculatePersonality();
      setTravelerType(personality);
      
      // Convert responses to travel profile
      const profile: TravelProfile = {
        adventureLevel: 'medium' as any,
        explorationStyle: 'mixed' as any,
        budgetLevel: 'moderate' as any,
        pacePreference: 'moderate' as any,
        groupDynamic: 'solo' as any,
        travelerType: personality.type,
        quizResponses: responses,
        createdAt: new Date()
      };

      console.log('Saving travel profile:', profile);
      await saveTravelProfile(profile);
      console.log('Travel profile saved successfully!');
      
      // Show result page
      setShowResult(true);
      
    } catch (error) {
      console.error('Error saving travel profile:', error);
      toast.error('Error saving profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResultContinue = () => {
    console.log('Navigating to dashboard...');
    toast.success('Welcome to your personalized dashboard!');
    navigate('/dashboard', { replace: true });
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQ = questions[currentQuestion];

  // Map traveler types to image filenames
  const getImageName = (travelerType: TravelerType): string => {
    const imageMap: Record<TravelerType, string> = {
      'Budget Backpacker': 'budget',
      'Culinary Explorer': 'culinary',
      'Cultural Explorer': 'cultural',
      'Family Traveler': 'family',
      'Hidden Gem Hunter': 'hidden',
      'Luxe Unwinder': 'luxe',
      'Social Connector': 'social',
      'Thrill Seeker': 'thrill'
    };
    return imageMap[travelerType];
  };

  // Result page component
  if (showResult && travelerType) {
    return (
      <div 
        className="min-h-screen w-full flex flex-col items-center justify-center" 
        style={{ 
          backgroundColor: '#DBDEDD', 
          height: '100vh', 
          width: '100vw',
          backgroundImage: 'none',
          position: 'fixed',
          top: 0,
          left: 0
        }}
      >
        {/* Content */}
        <div className="flex flex-col items-center justify-center text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-8 play-regular">
            YOU ARE...
          </h2>
          <div className="flex justify-center w-full">
            <img 
              src={`/${getImageName(travelerType.type)}.png`}
              alt={travelerType.type}
              className="w-96 h-96 object-cover rounded-3xl shadow-2xl mb-8"
            />
          </div>

          <div className="mt-8 flex justify-center items-center">
            <Button
              onClick={handleResultContinue}
              size="lg"
              className="glass-btn-primary px-8 py-8 text-lg font-semibold"
            >
              Continue to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz page component
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#DBDEDD', height: '100vh', backgroundImage: 'none' }}>
      {/* Top bar */}
      <div className="relative z-10 w-full px-10 py-10 flex justify-between items-center">
        <h1 className="text-3xl font-bold play-regular" style={{ fontSize: "1.5rem", marginLeft: "20px", marginTop: "10px" }}>Xplor</h1>
      </div>

      {/* Content */}
      <div className="min-h-screen pt-20 pb-8 flex flex-col items-center justify-center">
        <div className="max-w-5xl mx-auto px-6 text-center">
          {/* Question Image */}
          <div className="mb-8 flex justify-center">
            <img 
              src={currentQ.backgroundImage} 
              alt={`Question ${currentQuestion + 1}`}
              className="w-20 h-10 object-cover rounded-3xl shadow-2xl" 
            />
          </div>

          {/* Question Text */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4 play-regular">
              Q{currentQuestion + 1}: {currentQ.category.charAt(0).toUpperCase() + currentQ.category.slice(1)}
            </h2>
            <h1 className="text-3xl font-bold text-gray-900 mb-8 play-regular leading-tight max-w-4xl mx-auto">
              {currentQ.question}
            </h1>
          </div>

          {/* Options - 2x2 Grid with Glassmorphism */}
          <div className="grid grid-cols-2 gap-6 mb-16 max-w-4xl mx-auto" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', rowGap: '0.6rem', columnGap: '0.3rem'}}>
            {currentQ.options.map((option) => {
              const isSelected = getSelectedOption(currentQ.id) === option.id;
              
              return (
                <button
                  key={option.id}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Button clicked:', option.id);
                    handleOptionSelect(currentQ.id, option.id);
                  }}
                  className={`
                    glass-card p-6 rounded-xl transition-all duration-300 
                    hover:scale-105 transform cursor-pointer text-left
                    w-full
                    ${isSelected 
                      ? 'glass-strong border-white/50 shadow-2xl scale-105' 
                      : 'hover:glass-strong shadow-xl hover:shadow-2xl'
                    }
                  `}
                  type="button"
                  style={{ width: '100%', height: '60px' }}
                >
                  <div className="flex flex-col justify-between h-full">
                    <div className="flex justify-between items-start">
                      <p className="text-gray-800 text-base leading-relaxed play-regular font-medium ml-4">
                      {option.text}
                    </p>
                      {isSelected && (
                        <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center ml-4">
                          <Check size={20} className="text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          {/* Navigation */}
          <div className="fixed left-0 right-0 flex justify-between px-8" style={{ bottom: '-40px' }}>
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="flex items-center gap-2 px-4 py-4 rounded-full glass-button disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105"
              type="button"
            >
              <ArrowLeft size={20} className="text-primary-600" />
              <span className="font-medium">Previous</span>
            </button>

            <button
              onClick={handleNext}
              disabled={!canGoNext()}
              className="flex items-center gap-2 px-4 py-4 rounded-full glass-button disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105"
              type="button"
            >
              <span className="font-medium">
              {currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}
              </span>
              <ArrowRight size={20} className="text-primary-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;