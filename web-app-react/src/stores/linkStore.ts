import { create } from 'zustand';
import { GoLink } from '@/types';

interface LinkState {
  links: GoLink[];
  searchQuery: string;
  filteredLinks: GoLink[];
  selectedLink: GoLink | null;
  isModalOpen: boolean;
  
  setLinks: (links: GoLink[]) => void;
  setSearchQuery: (query: string) => void;
  setSelectedLink: (link: GoLink | null) => void;
  setModalOpen: (open: boolean) => void;
  addLink: (link: GoLink) => void;
  updateLink: (id: string, updates: Partial<GoLink>) => void;
  removeLink: (id: string) => void;
  filterLinks: () => void;
}

export const useLinkStore = create<LinkState>((set, get) => ({
  links: [],
  searchQuery: '',
  filteredLinks: [],
  selectedLink: null,
  isModalOpen: false,
  
  setLinks: (links) => {
    set({ links });
    get().filterLinks();
  },
  
  setSearchQuery: (searchQuery) => {
    set({ searchQuery });
    get().filterLinks();
  },
  
  setSelectedLink: (selectedLink) => {
    set({ selectedLink });
  },
  
  setModalOpen: (isModalOpen) => {
    set({ isModalOpen });
    if (!isModalOpen) {
      set({ selectedLink: null });
    }
  },
  
  addLink: (link) => {
    set((state) => ({
      links: [link, ...state.links],
    }));
    get().filterLinks();
  },
  
  updateLink: (id, updates) => {
    set((state) => ({
      links: state.links.map((link) =>
        link.id === id ? { ...link, ...updates } : link
      ),
    }));
    get().filterLinks();
  },
  
  removeLink: (id) => {
    set((state) => ({
      links: state.links.filter((link) => link.id !== id),
    }));
    get().filterLinks();
  },
  
  filterLinks: () => {
    const { links, searchQuery } = get();
    
    if (!searchQuery.trim()) {
      set({ filteredLinks: links });
      return;
    }
    
    const filtered = links.filter((link) => {
      const query = searchQuery.toLowerCase();
      return (
        link.shortcut.toLowerCase().includes(query) ||
        link.url.toLowerCase().includes(query) ||
        link.description?.toLowerCase().includes(query)
      );
    });
    
    set({ filteredLinks: filtered });
  },
}));