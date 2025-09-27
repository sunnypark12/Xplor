import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Calendar, Users, MapPin, Plus, X } from 'lucide-react';
import { useTravel } from '../contexts/TravelContext';
import { TripInput, TripConstraint } from '../types';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

interface TripPlanningFormData {
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  budget: number;
  accommodation: string;
  specialInterests: string;
}

const TripPlanning: React.FC = () => {
  const navigate = useNavigate();
  const { createItinerary, travelProfile } = useTravel();
  const [constraints, setConstraints] = useState<TripConstraint[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError
  } = useForm<TripPlanningFormData>();

  const startDate = watch('startDate');

  const addConstraint = (type: TripConstraint['type'], description: string) => {
    if (description.trim()) {
      setConstraints([...constraints, { type, description: description.trim() }]);
    }
  };

  const removeConstraint = (index: number) => {
    setConstraints(constraints.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: TripPlanningFormData) => {
    try {
      setIsSubmitting(true);

      const tripInput: TripInput = {
        destination: data.destination,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        travelers: data.travelers,
        specialInterests: data.specialInterests ? data.specialInterests.split(',').map(s => s.trim()) : [],
        constraints,
        budget: data.budget || undefined,
        accommodation: data.accommodation || undefined
      };

      await createItinerary(tripInput);
      navigate('/dashboard');
    } catch (error: any) {
      setError('root', {
        type: 'manual',
        message: error.message || 'Failed to create itinerary'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const constraintTypes = [
    { value: 'mobility', label: 'Mobility Requirements' },
    { value: 'dietary', label: 'Dietary Restrictions' },
    { value: 'time', label: 'Time Constraints' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Plan Your Next Adventure</h1>
          <p className="text-primary-100">
            Tell us about your trip and we'll create a personalized itinerary just for you.
          </p>
        </div>

        {/* Travel Profile Status */}
        {!travelProfile && (
          <div className="bg-amber-50 border-b border-amber-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                  <span className="text-amber-600 text-sm">!</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-amber-800">
                    Complete your travel profile for better recommendations
                  </p>
                  <p className="text-sm text-amber-700">
                    Take our quick quiz to get personalized trip suggestions.
                  </p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-amber-300 text-amber-700 hover:bg-amber-50"
                onClick={() => navigate('/quiz')}
              >
                Take Quiz
              </Button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
          {/* Basic Trip Details */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Input
                label="Destination"
                placeholder="e.g., Tokyo, Japan"
                icon={<MapPin size={16} />}
                error={errors.destination?.message}
                {...register('destination', {
                  required: 'Destination is required'
                })}
              />
            </div>

            <Input
              label="Start Date"
              type="date"
              icon={<Calendar size={16} />}
              error={errors.startDate?.message}
              {...register('startDate', {
                required: 'Start date is required',
                validate: (value) => {
                  const selectedDate = new Date(value);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return selectedDate >= today || 'Start date must be today or later';
                }
              })}
            />

            <Input
              label="End Date"
              type="date"
              icon={<Calendar size={16} />}
              error={errors.endDate?.message}
              {...register('endDate', {
                required: 'End date is required',
                validate: (value) => {
                  if (!startDate) return true;
                  const start = new Date(startDate);
                  const end = new Date(value);
                  return end > start || 'End date must be after start date';
                }
              })}
            />

            <Input
              label="Number of Travelers"
              type="number"
              min="1"
              max="20"
              icon={<Users size={16} />}
              error={errors.travelers?.message}
              {...register('travelers', {
                required: 'Number of travelers is required',
                min: { value: 1, message: 'At least 1 traveler required' },
                max: { value: 20, message: 'Maximum 20 travelers' },
                valueAsNumber: true
              })}
            />

            <Input
              label="Budget (Optional)"
              type="number"
              placeholder="Total budget in USD"
              helperText="This helps us suggest appropriate activities and accommodations"
              {...register('budget', { valueAsNumber: true })}
            />
          </div>

          {/* Special Interests */}
          <div>
            <Input
              label="Special Interests (Optional)"
              placeholder="e.g., museums, food tours, nightlife, shopping"
              helperText="Separate multiple interests with commas"
              {...register('specialInterests')}
            />
          </div>

          {/* Accommodation Preference */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Accommodation Preference (Optional)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['Hotel', 'Hostel', 'Airbnb', 'Resort'].map((type) => (
                <label key={type} className="flex items-center">
                  <input
                    type="radio"
                    value={type.toLowerCase()}
                    className="mr-2 text-primary-600 focus:ring-primary-500"
                    {...register('accommodation')}
                  />
                  <span className="text-sm text-gray-700">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Constraints */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Special Requirements or Constraints
              </label>
            </div>

            {/* Add Constraint Form */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <ConstraintForm onAdd={addConstraint} types={constraintTypes} />
            </div>

            {/* Current Constraints */}
            {constraints.length > 0 && (
              <div className="space-y-2">
                {constraints.map((constraint, index) => (
                  <div key={index} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3">
                    <div>
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        {constraintTypes.find(t => t.value === constraint.type)?.label}
                      </span>
                      <p className="text-sm text-gray-900">{constraint.description}</p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeConstraint(index)}
                      icon={<X size={16} />}
                      className="text-gray-400 hover:text-red-500"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Error Message */}
          {errors.root && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">
                {errors.root.message}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isSubmitting}
              size="lg"
              className="px-8"
            >
              Create Itinerary
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Constraint Form Component
interface ConstraintFormProps {
  onAdd: (type: TripConstraint['type'], description: string) => void;
  types: { value: string; label: string }[];
}

const ConstraintForm: React.FC<ConstraintFormProps> = ({ onAdd, types }) => {
  const [selectedType, setSelectedType] = useState<TripConstraint['type']>('other');
  const [description, setDescription] = useState('');

  const handleAdd = () => {
    if (description.trim()) {
      onAdd(selectedType, description);
      setDescription('');
    }
  };

  return (
    <div className="flex items-end space-x-3">
      <div className="flex-1">
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Type
        </label>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as TripConstraint['type'])}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-primary-500 focus:border-primary-500"
        >
          {types.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-[2]">
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Description
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your requirement..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-primary-500 focus:border-primary-500"
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
        />
      </div>
      <Button
        type="button"
        onClick={handleAdd}
        disabled={!description.trim()}
        icon={<Plus size={16} />}
        size="sm"
      >
        Add
      </Button>
    </div>
  );
};

export default TripPlanning;
