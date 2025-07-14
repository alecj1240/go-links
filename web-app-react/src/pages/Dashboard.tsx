import { useState, useEffect } from 'react';
import { NavBar } from '@/components/common/NavBar';
import { SearchBar } from '@/components/dashboard/SearchBar';
import { LinkGrid } from '@/components/dashboard/LinkGrid';
import { LinkModal } from '@/components/dashboard/LinkModal';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';
import { useLinks } from '@/hooks/useLinks';
import { useExtension } from '@/hooks/useExtension';
import { GoLink } from '@/types';

export const Dashboard = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const { 
    links, 
    isLoading, 
    error, 
    searchQuery, 
    setSearchQuery, 
    createLink, 
    updateLink, 
    deleteLink,
    isCreating,
    isUpdating,
    isDeleting 
  } = useLinks();
  const { extensionStatus, syncWithExtension } = useExtension();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<GoLink | null>(null);

  // Sync with extension whenever links change
  useEffect(() => {
    if (links.length > 0) {
      syncWithExtension({ links });
    }
  }, [links, syncWithExtension]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  const handleAddLink = () => {
    setEditingLink(null);
    setIsModalOpen(true);
  };

  const handleEditLink = (link: GoLink) => {
    setEditingLink(link);
    setIsModalOpen(true);
  };

  const handleDeleteLink = async (id: string) => {
    try {
      await deleteLink(id);
    } catch (error) {
      alert('Failed to delete link. Please try again.');
    }
  };

  const handleSaveLink = async (data: { shortcut: string; url: string; description: string }) => {
    try {
      if (editingLink) {
        await updateLink(editingLink.id, data);
      } else {
        await createLink(data.shortcut, data.url, data.description);
      }
    } catch (error: any) {
      const message = error?.message || 'Failed to save link. Please try again.';
      alert(message);
      throw error; // Re-throw to prevent modal from closing
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="container py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">Dashboard</h1>
              <p className="text-xl text-gray-600">
                Welcome back, <span className="font-semibold text-gray-900">{profile?.full_name || user?.email}</span>
              </p>
            </div>
            <button
              onClick={handleAddLink}
              className="button button-accent button-lg flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Link
            </button>
          </div>


          {/* Search and stats */}
          <div className="flex items-center justify-between gap-6 mb-8">
            <div className="flex-1 max-w-lg">
              <SearchBar 
                onSearch={setSearchQuery}
                placeholder="Search your links..."
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                <span className="text-sm font-medium text-gray-600">
                  {links.length} {links.length === 1 ? 'link' : 'links'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mb-12">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="large" />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-600 mb-4">
                Failed to load links. Please try again.
              </div>
              <button 
                onClick={() => window.location.reload()}
                className="button button-secondary"
              >
                Retry
              </button>
            </div>
          ) : (
            <LinkGrid
              links={links}
              onEdit={handleEditLink}
              onDelete={handleDeleteLink}
              onAddFirst={handleAddLink}
              searchQuery={searchQuery}
            />
          )}
        </div>

        {/* Modal */}
        <LinkModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveLink}
          editingLink={editingLink}
          isLoading={isCreating || isUpdating}
        />
      </main>
    </div>
  );
};