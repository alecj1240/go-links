import { GoLink } from '@/types';
import { LinkCard } from './LinkCard';
import { EmptyState } from '@/components/common/EmptyState';

interface LinkGridProps {
  links: GoLink[];
  onEdit: (link: GoLink) => void;
  onDelete: (id: string) => void;
  onAddFirst: () => void;
  searchQuery?: string;
}

export const LinkGrid = ({ links, onEdit, onDelete, onAddFirst, searchQuery }: LinkGridProps) => {
  if (links.length === 0) {
    const isSearching = searchQuery && searchQuery.length > 0;
    
    return (
      <EmptyState
        icon={
          <svg 
            className="w-16 h-16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
        }
        title={isSearching ? 'No matching links' : 'No links yet'}
        description={
          isSearching 
            ? `No links found matching "${searchQuery}"`
            : 'Create your first go link to get started'
        }
        action={
          !isSearching && (
            <button 
              onClick={onAddFirst}
              className="button button-primary"
            >
              Add Your First Link
            </button>
          )
        }
      />
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {links.map((link) => (
        <LinkCard
          key={link.id}
          link={link}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};