import { GoLink, ImportResult } from '@/types';

export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validateShortcut = (shortcut: string): boolean => {
  // Must be alphanumeric with hyphens/underscores, 1-50 characters
  const regex = /^[a-zA-Z0-9_-]{1,50}$/;
  return regex.test(shortcut);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

export const downloadFile = (content: string, filename: string, type: string = 'application/json') => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportLinksToJson = (links: GoLink[]): string => {
  const exportData = {
    links,
    exportedAt: new Date().toISOString(),
    version: '1.0',
  };
  return JSON.stringify(exportData, null, 2);
};

export const exportLinksToCsv = (links: GoLink[]): string => {
  const headers = ['Shortcut', 'URL', 'Description', 'Created At'];
  const rows = links.map(link => [
    link.shortcut,
    link.url,
    link.description || '',
    formatDateTime(link.created_at),
  ]);
  
  const csvContent = [headers, ...rows]
    .map(row => row.map(field => `"${field.replace(/"/g, '""')}"`).join(','))
    .join('\n');
    
  return csvContent;
};

export const parseImportFile = async (file: File): Promise<ImportResult> => {
  const result: ImportResult = {
    success: 0,
    errors: [],
    total: 0,
  };

  try {
    const content = await file.text();
    
    if (file.type === 'application/json') {
      const data = JSON.parse(content);
      const links = Array.isArray(data) ? data : data.links || [];
      
      result.total = links.length;
      
      links.forEach((link: any, index: number) => {
        if (!link.shortcut || !link.url) {
          result.errors.push({
            row: index + 1,
            error: 'Missing required fields (shortcut, url)',
          });
          return;
        }
        
        if (!validateShortcut(link.shortcut)) {
          result.errors.push({
            row: index + 1,
            error: 'Invalid shortcut format',
          });
          return;
        }
        
        if (!validateUrl(link.url)) {
          result.errors.push({
            row: index + 1,
            error: 'Invalid URL format',
          });
          return;
        }
        
        result.success++;
      });
    } else if (file.type === 'text/csv') {
      const lines = content.split('\n').filter(line => line.trim());
      const [, ...dataLines] = lines; // Skip header
      
      result.total = dataLines.length;
      
      dataLines.forEach((line, index) => {
        const [shortcut, url, description] = line.split(',').map(field => 
          field.replace(/^"|"$/g, '').replace(/""/g, '"')
        );
        
        if (!shortcut || !url) {
          result.errors.push({
            row: index + 2, // +2 because we skip header and arrays are 0-indexed
            error: 'Missing required fields (shortcut, url)',
          });
          return;
        }
        
        if (!validateShortcut(shortcut)) {
          result.errors.push({
            row: index + 2,
            error: 'Invalid shortcut format',
          });
          return;
        }
        
        if (!validateUrl(url)) {
          result.errors.push({
            row: index + 2,
            error: 'Invalid URL format',
          });
          return;
        }
        
        result.success++;
      });
    } else {
      throw new Error('Unsupported file type');
    }
  } catch (error) {
    result.errors.push({
      row: 0,
      error: error instanceof Error ? error.message : 'Failed to parse file',
    });
  }

  return result;
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};