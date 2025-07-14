import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { UserSettings, UpdateUserSettings } from '@/types';

export const useSettings = () => {
  const queryClient = useQueryClient();

  // Query for fetching user settings
  const {
    data: settings,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['userSettings'],
    queryFn: () => api.getSettings(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  // Update settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: (updates: UpdateUserSettings) => api.updateSettings(updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userSettings'] });
    },
  });

  const updateSettings = async (updates: UpdateUserSettings) => {
    try {
      return await updateSettingsMutation.mutateAsync(updates);
    } catch (error) {
      throw error;
    }
  };

  return {
    settings,
    isLoading,
    error,
    updateSettings,
    isUpdating: updateSettingsMutation.isPending,
  };
};