import { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => {
  return (
    <div className="text-center py-12">
      {icon && (
        <div className="mb-4 flex justify-center" style={{ color: 'var(--text-secondary)' }}>
          {icon}
        </div>
      )}
      <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
        {title}
      </h3>
      {description && (
        <p className="mb-6 max-w-sm mx-auto" style={{ color: 'var(--text-secondary)' }}>
          {description}
        </p>
      )}
      {action && action}
    </div>
  );
};