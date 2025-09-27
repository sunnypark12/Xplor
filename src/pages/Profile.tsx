import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Calendar, MapPin, Settings, Edit3 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTravel } from '../contexts/TravelContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { travelProfile } = useTravel();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    email: user?.email || ''
  });

  const handleSave = async () => {
    try {
      setIsLoading(true);
      await updateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      displayName: user?.displayName || '',
      email: user?.email || ''
    });
    setIsEditing(false);
  };

  const getTravelStyleDescription = () => {
    if (!travelProfile) return null;

    const styles = {
      adventureLevel: {
        low: 'Peaceful & Relaxing',
        medium: 'Balanced Mix',
        high: 'Thrilling Adventures'
      },
      explorationStyle: {
        foodie: 'Foodie Explorer',
        cultural: 'Culture Enthusiast',
        nature: 'Nature Lover',
        mixed: 'Well-Rounded Explorer'
      },
      budgetLevel: {
        budget: 'Budget-Conscious',
        moderate: 'Moderate Spender',
        luxury: 'Luxury Traveler'
      },
      pacePreference: {
        slow: 'Slow & Immersive',
        moderate: 'Balanced Pace',
        fast: 'Action-Packed'
      },
      groupDynamic: {
        solo: 'Solo Adventurer',
        couple: 'Couple Traveler',
        family: 'Family Explorer',
        friends: 'Group Traveler'
      }
    };

    return {
      adventure: styles.adventureLevel[travelProfile.adventureLevel],
      exploration: styles.explorationStyle[travelProfile.explorationStyle],
      budget: styles.budgetLevel[travelProfile.budgetLevel],
      pace: styles.pacePreference[travelProfile.pacePreference],
      group: styles.groupDynamic[travelProfile.groupDynamic]
    };
  };

  const travelStyleDesc = getTravelStyleDescription();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  className="w-20 h-20 rounded-full"
                />
              ) : (
                <User size={32} className="text-primary-600" />
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {user?.displayName || 'Your Profile'}
              </h1>
              <div className="flex items-center space-x-4 text-gray-600">
                <div className="flex items-center space-x-1">
                  <Mail size={16} />
                  <span>{user?.email}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar size={16} />
                  <span>Joined {user?.createdAt ? user.createdAt.toLocaleDateString() : 'Unknown'}</span>
                </div>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            icon={<Edit3 size={16} />}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </Button>
        </div>
      </div>

      {/* Edit Profile Form */}
      {isEditing && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Edit Profile</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="Display Name"
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
            />
            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled
              helperText="Email cannot be changed"
            />
          </div>
          <div className="flex items-center justify-end space-x-4 mt-6">
            <Button variant="ghost" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave} loading={isLoading}>
              Save Changes
            </Button>
          </div>
        </div>
      )}

      {/* Travel Profile */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Travel Profile</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/quiz')}
          >
            {travelProfile ? 'Retake Quiz' : 'Take Quiz'}
          </Button>
        </div>

        {travelProfile && travelStyleDesc ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600">Adventure Level</p>
              <p className="text-lg text-gray-900">{travelStyleDesc.adventure}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600">Exploration Style</p>
              <p className="text-lg text-gray-900">{travelStyleDesc.exploration}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600">Budget Preference</p>
              <p className="text-lg text-gray-900">{travelStyleDesc.budget}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600">Travel Pace</p>
              <p className="text-lg text-gray-900">{travelStyleDesc.pace}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600">Travel Style</p>
              <p className="text-lg text-gray-900">{travelStyleDesc.group}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600">Profile Created</p>
              <p className="text-lg text-gray-900">
                {travelProfile.createdAt ? new Date(travelProfile.createdAt).toLocaleDateString() : 'Unknown'}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Travel Profile Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Take our quick quiz to create your personalized travel profile and get better recommendations.
            </p>
            <Button onClick={() => navigate('/quiz')}>
              Take Travel Quiz
            </Button>
          </div>
        )}
      </div>

      {/* Travel Statistics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Travel Statistics</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-primary-50 rounded-lg">
            <div className="text-3xl font-bold text-primary-600 mb-2">12</div>
            <p className="text-sm font-medium text-gray-600">Countries Visited</p>
          </div>
          <div className="text-center p-6 bg-green-50 rounded-lg">
            <div className="text-3xl font-bold text-green-600 mb-2">28</div>
            <p className="text-sm font-medium text-gray-600">Total Trips</p>
          </div>
          <div className="text-center p-6 bg-blue-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-600 mb-2">147</div>
            <p className="text-sm font-medium text-gray-600">Hours Saved</p>
          </div>
        </div>
      </div>

      {/* Account Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div>
              <h3 className="font-medium text-gray-900">Notifications</h3>
              <p className="text-sm text-gray-600">Manage your notification preferences</p>
            </div>
            <Button variant="outline" size="sm" icon={<Settings size={16} />}>
              Configure
            </Button>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div>
              <h3 className="font-medium text-gray-900">Privacy</h3>
              <p className="text-sm text-gray-600">Control your privacy settings</p>
            </div>
            <Button variant="outline" size="sm" icon={<Settings size={16} />}>
              Manage
            </Button>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <h3 className="font-medium text-gray-900">Data Export</h3>
              <p className="text-sm text-gray-600">Download your travel data</p>
            </div>
            <Button variant="outline" size="sm">
              Export
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
