import { useState, useEffect } from 'react';
import { Modal } from '@/components/common/Modal';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { GoLink } from '@/types';
import { validateUrl, validateShortcut } from '@/utils/helpers';

interface LinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { shortcut: string; url: string; description: string }) => Promise<void>;
  editingLink?: GoLink | null;
  isLoading?: boolean;
}

export const LinkModal = ({ isOpen, onClose, onSave, editingLink, isLoading = false }: LinkModalProps) => {
  const [formData, setFormData] = useState({
    shortcut: '',
    url: '',
    description: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingLink) {
      setFormData({
        shortcut: editingLink.shortcut,
        url: editingLink.url,
        description: editingLink.description || '',
      });
    } else {
      setFormData({
        shortcut: '',
        url: '',
        description: '',
      });
    }
    setErrors({});
  }, [editingLink, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.shortcut.trim()) {
      newErrors.shortcut = 'Shortcut is required';
    } else if (!validateShortcut(formData.shortcut)) {
      newErrors.shortcut = 'Shortcut must be 1-50 characters, letters, numbers, hyphens, and underscores only';
    }

    if (!formData.url.trim()) {
      newErrors.url = 'URL is required';
    } else if (!validateUrl(formData.url)) {
      newErrors.url = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await onSave({
        shortcut: formData.shortcut.trim(),
        url: formData.url.trim(),
        description: formData.description.trim(),
      });
      onClose();
    } catch (error) {
      // Error handling is done in the parent component
      console.error('Form submission error:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingLink ? 'Edit Link' : 'Add Link'}
      size="medium"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="shortcut" className="block text-sm font-medium mb-1">
            Shortcut <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center">
            <span className="text-gray-500 mr-1">go/</span>
            <input
              type="text"
              id="shortcut"
              name="shortcut"
              value={formData.shortcut}
              onChange={handleChange}
              placeholder="calendar"
              className={`flex-1 px-3 py-2 border rounded-md ${
                errors.shortcut ? 'border-red-500' : ''
              }`}
              disabled={isLoading}
            />
          </div>
          {errors.shortcut && (
            <p className="text-red-500 text-sm mt-1">{errors.shortcut}</p>
          )}
        </div>

        <div>
          <label htmlFor="url" className="block text-sm font-medium mb-1">
            URL <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            id="url"
            name="url"
            value={formData.url}
            onChange={handleChange}
            placeholder="https://calendar.google.com"
            className={`w-full px-3 py-2 border rounded-md ${
              errors.url ? 'border-red-500' : ''
            }`}
            disabled={isLoading}
          />
          {errors.url && (
            <p className="text-red-500 text-sm mt-1">{errors.url}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Google Calendar"
            rows={3}
            className="w-full px-3 py-2 border rounded-md"
            disabled={isLoading}
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="button button-secondary"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="button button-accent flex items-center gap-2"
            disabled={isLoading}
          >
            {isLoading && <LoadingSpinner size="small" />}
            {editingLink ? 'Update Link' : 'Create Link'}
          </button>
        </div>
      </form>
    </Modal>
  );
};