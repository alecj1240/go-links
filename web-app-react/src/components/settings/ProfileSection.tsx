import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/services/api';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export const ProfileSection = () => {
  const { user, profile, refreshProfile } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (user && profile) {
      setFormData({
        email: user.email || '',
        fullName: profile.full_name || '',
      });
    }
  }, [user, profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      await api.updateProfile({
        full_name: formData.fullName.trim(),
      });
      
      await refreshProfile();
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      console.error('Failed to update profile:', error);
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const avatarUrl = profile?.avatar_url || 
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.email || '')}&background=000&color=fff`;

  return (
    <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
      <h2 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">Profile</h2>
      
      <div className="flex items-center gap-6 mb-8">
        <img
          src={avatarUrl}
          alt="Profile"
          className="w-16 h-16 rounded-full"
        />
        <div>
          <h3 className="font-medium text-lg">{profile?.full_name || user?.email}</h3>
          <p className="text-gray-600">{user?.email}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            disabled
            className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
          />
          <p className="text-sm mt-2 text-gray-500">
            Email cannot be changed
          </p>
        </div>

        <div>
          <label htmlFor="fullName" className="block text-sm font-medium mb-2 text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
            disabled={isLoading}
          />
        </div>

        {message && (
          <div 
            className={`p-3 rounded-md ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="button button-accent flex items-center gap-2"
        >
          {isLoading && <LoadingSpinner size="small" />}
          {isLoading ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
};