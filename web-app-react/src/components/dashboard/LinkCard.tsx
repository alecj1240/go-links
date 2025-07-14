import { GoLink } from '@/types';

interface LinkCardProps {
  link: GoLink;
  onEdit: (link: GoLink) => void;
  onDelete: (id: string) => void;
}

export const LinkCard = ({ link, onEdit, onDelete }: LinkCardProps) => {
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this link?')) {
      onDelete(link.id);
    }
  };

  return (
    <div 
      className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-gray-200 hover:-translate-y-1"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center group-hover:from-green-200 group-hover:to-emerald-200 transition-all duration-300">
            <svg 
              className="w-5 h-5 text-green-600" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
          </div>
          <div>
            <span className="font-bold text-lg block leading-tight">
              go/{link.shortcut}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => onEdit(link)}
            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 transition-all duration-200 rounded-lg"
            title="Edit link"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>
          
          <button
            onClick={handleDelete}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200 rounded-lg"
            title="Delete link"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </div>
      
      <div className="mb-4">
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-600 hover:text-green-700 break-all text-sm bg-green-50 hover:bg-green-100 px-3 py-2 rounded-lg border border-green-100 hover:border-green-200 transition-all duration-200 inline-block"
        >
          {link.url.length > 50 ? `${link.url.substring(0, 50)}...` : link.url}
        </a>
      </div>
      
      {link.description && (
        <div className="mb-4">
          <p className="text-gray-600 italic leading-relaxed">{link.description}</p>
        </div>
      )}
    </div>
  );
};