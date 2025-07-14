import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { GoLink, InsertGoLink, UpdateGoLink } from '@/types';

export const useLinks = () => {
  const queryClient = useQueryClient();

  // Query for fetching all links
  const {
    data: links = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['goLinks'],
    queryFn: () => api.getGoLinks(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Create link mutation
  const createLinkMutation = useMutation({
    mutationFn: ({ shortcut, url, description }: { shortcut: string; url: string; description?: string }) =>
      api.createGoLink(shortcut, url, description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goLinks'] });
    },
  });

  // Update link mutation
  const updateLinkMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateGoLink }) =>
      api.updateGoLink(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goLinks'] });
    },
  });

  // Delete link mutation
  const deleteLinkMutation = useMutation({
    mutationFn: (id: string) => api.deleteGoLink(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goLinks'] });
    },
  });

  // Search functionality
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredLinks, setFilteredLinks] = useState<GoLink[]>([]);

  const filterLinks = useCallback((query: string) => {
    if (!query.trim()) {
      setFilteredLinks(links);
      return;
    }

    const filtered = links.filter((link) => {
      const searchTerm = query.toLowerCase();
      return (
        link.shortcut.toLowerCase().includes(searchTerm) ||
        link.url.toLowerCase().includes(searchTerm) ||
        link.description?.toLowerCase().includes(searchTerm)
      );
    });

    setFilteredLinks(filtered);
  }, [links]);

  useEffect(() => {
    filterLinks(searchQuery);
  }, [searchQuery, filterLinks]);

  // Real-time subscription
  useEffect(() => {
    const subscription = api.subscribeToGoLinks((payload) => {
      console.log('Real-time update:', payload);
      queryClient.invalidateQueries({ queryKey: ['goLinks'] });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);

  const createLink = useCallback(
    async (shortcut: string, url: string, description?: string) => {
      try {
        return await createLinkMutation.mutateAsync({ shortcut, url, description });
      } catch (error) {
        throw error;
      }
    },
    [createLinkMutation]
  );

  const updateLink = useCallback(
    async (id: string, updates: UpdateGoLink) => {
      try {
        return await updateLinkMutation.mutateAsync({ id, updates });
      } catch (error) {
        throw error;
      }
    },
    [updateLinkMutation]
  );

  const deleteLink = useCallback(
    async (id: string) => {
      try {
        await deleteLinkMutation.mutateAsync(id);
      } catch (error) {
        throw error;
      }
    },
    [deleteLinkMutation]
  );

  return {
    links: searchQuery ? filteredLinks : links,
    allLinks: links,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    createLink,
    updateLink,
    deleteLink,
    refetch,
    isCreating: createLinkMutation.isPending,
    isUpdating: updateLinkMutation.isPending,
    isDeleting: deleteLinkMutation.isPending,
  };
};