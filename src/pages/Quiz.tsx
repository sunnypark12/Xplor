import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { useTravel } from '../contexts/TravelContext';
import { TravelProfile, QuizQuestion, QuizResponse } from '../types';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';

const Quiz: React.FC = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<QuizResponse[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      // For now, just navigate to dashboard
      navigate('/dashboard');
    };
  }

  // Quiz questions data
  const questions: QuizQuestion[] = [
    {
      id: 'adventure_level',
      question: "What's your ideal vacation vibe?",
      type: 'single',
      category: 'adventureLevel',
      options: [
        {
          id: 'low',
          text: 'Peaceful & Relaxing',
          value: 'low',
          image: '🏖️'
        },
        {
          id: 'medium',
          text: 'Balanced Mix',
          value: 'medium',
          image: '🏛️'
        },
        {
          id: 'high',
          text: 'Thrilling Adventures',
          value: 'high',
          image: '🏔️'
        }
      ]
    },
    {
      id: 'exploration_style',
      question: "What gets you most excited when traveling?",
      type: 'single',
      category: 'explorationStyle',
      options: [
        {
          id: 'foodie',
          text: 'Amazing Local Cuisine',
          value: 'foodie',
          image: '🍜'
        },
        {
          id: 'cultural',
          text: 'History & Culture',
          value: 'cultural',
          image: '🏛️'
        },
        {
          id: 'nature',
          text: 'Beautiful Landscapes',
          value: 'nature',
          image: '🌲'
        },
        {
          id: 'mixed',
          text: 'A bit of everything',
          value: 'mixed',
          image: '🌟'
        }
      ]
    },
    {
      id: 'budget_level',
      question: "How do you prefer to spend on travel?",
      type: 'single',
      category: 'budgetLevel',
      options: [
        {
          id: 'budget',
          text: 'Budget-Conscious',
          value: 'budget',
          image: '💰'
        },
        {
          id: 'moderate',
          text: 'Moderate Spending',
          value: 'moderate',
          image: '💳'
        },
        {
          id: 'luxury',
          text: 'Luxury Experience',
          value: 'luxury',
          image: '💎'
        }
      ]
    },
    {
      id: 'pace_preference',
      question: "What's your preferred travel pace?",
      type: 'single',
      category: 'pacePreference',
      options: [
        {
          id: 'slow',
          text: 'Slow & Immersive',
          value: 'slow',
          image: '🐌'
        },
        {
          id: 'moderate',
          text: 'Balanced Schedule',
          value: 'moderate',
          image: '⚖️'
        },
        {
          id: 'fast',
          text: 'Action-Packed',
          value: 'fast',
          image: '⚡'
        }
      ]
    },
    {
      id: 'group_dynamic',
      question: "Who do you usually travel with?",
      type: 'single',
      category: 'groupDynamic',
      options: [
        {
          id: 'solo',
          text: 'Solo Adventures',
          value: 'solo',
          image: '🎒'
        },
        {
          id: 'couple',
          text: 'As a Couple',
          value: 'couple',
          image: '💕'
        },
        {
          id: 'family',
          text: 'Family Trips',
          value: 'family',
          image: '👨‍👩‍👧‍👦'
        },
        {
          id: 'friends',
          text: 'With Friends',
          value: 'friends',
          image: '👥'
        }
      ]
    }
  ];

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
      
      // Convert responses to travel profile
      const profile: TravelProfile = {
        adventureLevel: responses.find(r => r.questionId === 'adventure_level')?.selectedOptions[0] as any || 'medium',
        explorationStyle: responses.find(r => r.questionId === 'exploration_style')?.selectedOptions[0] as any || 'mixed',
        budgetLevel: responses.find(r => r.questionId === 'budget_level')?.selectedOptions[0] as any || 'moderate',
        pacePreference: responses.find(r => r.questionId === 'pace_preference')?.selectedOptions[0] as any || 'moderate',
        groupDynamic: responses.find(r => r.questionId === 'group_dynamic')?.selectedOptions[0] as any || 'solo',
        createdAt: new Date()
      };

      console.log('Saving travel profile:', profile);
      await saveTravelProfile(profile);
      console.log('Travel profile saved successfully!');
      
      // Show success message
      toast.success('Travel profile saved! Redirecting to dashboard...');
      
      // Small delay to ensure the profile is saved before navigation
      setTimeout(() => {
        console.log('Navigating to dashboard...');
        navigate('/dashboard', { replace: true });
      }, 1000);
    } catch (error) {
      console.error('Error saving travel profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQ = questions[currentQuestion];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Progress Bar */}
        <div className="bg-gray-200 h-2">
          <div 
            className="bg-primary-600 h-2 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Header */}
        <div className="p-8 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-primary-600">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {currentQ.question}
          </h1>
          <p className="text-gray-600">
            Select the option that best describes your travel preferences.
          </p>
        </div>

        {/* Question Content */}
        <div className="p-8">
          <div className="space-y-4">
            {currentQ.options.map((option) => {
              const isSelected = getSelectedOption(currentQ.id) === option.id;
              
              return (
                <button
                  key={option.id}
                  onClick={() => handleOptionSelect(currentQ.id, option.id)}
                  className={`
                    w-full p-6 rounded-xl border-2 transition-all duration-200 text-left
                    ${isSelected 
                      ? 'border-primary-500 bg-primary-50 shadow-sm' 
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }
                  `}
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">
                      {option.image}
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold ${isSelected ? 'text-primary-900' : 'text-gray-900'}`}>
                        {option.text}
                      </h3>
                    </div>
                    {isSelected && (
                      <div className="text-primary-600">
                        <Check size={24} />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="p-8 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              icon={<ChevronLeft size={16} />}
            >
              Previous
            </Button>

            <Button
              onClick={handleNext}
              disabled={!canGoNext()}
              loading={isSubmitting}
              icon={currentQuestion === questions.length - 1 ? <Check size={16} /> : <ChevronRight size={16} />}
              iconPosition="right"
            >
              {currentQuestion === questions.length - 1 ? 'Complete Quiz' : 'Next'}
            </Button>
          </div>
        </div>
      </div>

      {/* Quiz Info */}
      <div className="mt-8 text-center text-sm text-gray-600">
        <p>
          This quiz helps us understand your travel style to create personalized itineraries just for you.
        </p>
      </div>
    </div>
  );
};

export default Quiz;
