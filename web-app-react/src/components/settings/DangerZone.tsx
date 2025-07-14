import { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useLinks } from '@/hooks/useLinks';

export const DangerZone = () => {
  const { allLinks, deleteLink } = useLinks();
  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const handleDeleteAllLinks = async () => {
    setIsDeleting(true);
    
    try {
      // Delete all links one by one
      for (const link of allLinks) {
        await deleteLink(link.id);
      }
      
      alert('All links have been deleted.');
      setIsDeleteAllModalOpen(false);
    } catch (error) {
      console.error('Failed to delete all links:', error);
      alert('Failed to delete all links. Please try again.');
    } finally {
      setIsDeleting(false);
      setConfirmText('');
    }
  };

  const handleDeleteAccount = () => {
    // In a real implementation, this would call an API to delete the account
    alert('Account deletion is not implemented in this demo. In production, this would delete your account and all associated data.');
    setIsDeleteAccountModalOpen(false);
    setConfirmText('');
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <h2 className="text-lg font-medium mb-4 text-gray-700">Account Management</h2>
      
      <div className="space-y-4">
        {/* Delete All Links */}
        <div className="flex items-center justify-between py-2">
          <div>
            <span className="text-sm font-medium text-gray-700">Delete All Links</span>
            <p className="text-xs text-gray-500">Remove all your go links</p>
          </div>
          <button
            onClick={() => setIsDeleteAllModalOpen(true)}
            className="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md transition-colors"
            disabled={allLinks.length === 0}
          >
            Delete All
          </button>
        </div>

        {/* Delete Account */}
        <div className="flex items-center justify-between py-2 border-t border-gray-100">
          <div>
            <span className="text-sm font-medium text-gray-700">Delete Account</span>
            <p className="text-xs text-gray-500">Permanently delete your account</p>
          </div>
          <button
            onClick={() => setIsDeleteAccountModalOpen(true)}
            className="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md transition-colors"
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* Delete All Links Modal */}
      <Modal
        isOpen={isDeleteAllModalOpen}
        onClose={() => setIsDeleteAllModalOpen(false)}
        title="Delete All Links"
        size="medium"
      >
        <div className="space-y-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.08 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span className="font-medium text-red-600">Warning</span>
            </div>
            <p className="text-red-700 text-sm">
              This will permanently delete all {allLinks.length} of your go links. This action cannot be undone.
            </p>
          </div>

          <div>
            <label htmlFor="confirm-delete-all" className="block text-sm font-medium mb-2 text-gray-700">
              Type "DELETE ALL" to confirm:
            </label>
            <input
              type="text"
              id="confirm-delete-all"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE ALL"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => {
                setIsDeleteAllModalOpen(false);
                setConfirmText('');
              }}
              className="button button-secondary"
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteAllLinks}
              disabled={confirmText !== 'DELETE ALL' || isDeleting}
              className="button bg-red-600 text-white hover:bg-red-700 flex items-center gap-2"
            >
              {isDeleting && <LoadingSpinner size="small" />}
              {isDeleting ? 'Deleting...' : 'Delete All Links'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Account Modal */}
      <Modal
        isOpen={isDeleteAccountModalOpen}
        onClose={() => setIsDeleteAccountModalOpen(false)}
        title="Delete Account"
        size="medium"
      >
        <div className="space-y-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.08 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span className="font-medium text-red-600">Critical Warning</span>
            </div>
            <p className="text-red-700 text-sm">
              This will permanently delete your account and ALL associated data including:
            </p>
            <ul className="text-red-700 text-sm mt-2 list-disc list-inside">
              <li>All your go links</li>
              <li>Your profile information</li>
              <li>Your preferences and settings</li>
            </ul>
            <p className="text-red-700 text-sm mt-2 font-medium">
              This action cannot be undone.
            </p>
          </div>

          <div>
            <label htmlFor="confirm-delete-account" className="block text-sm font-medium mb-2 text-gray-700">
              Type "DELETE ACCOUNT" to confirm:
            </label>
            <input
              type="text"
              id="confirm-delete-account"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE ACCOUNT"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => {
                setIsDeleteAccountModalOpen(false);
                setConfirmText('');
              }}
              className="button button-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteAccount}
              disabled={confirmText !== 'DELETE ACCOUNT'}
              className="button bg-red-600 text-white hover:bg-red-700"
            >
              Delete Account
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};