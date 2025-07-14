declare global {
  interface Window {
    chrome?: {
      runtime?: {
        openOptionsPage?: () => void;
      };
    };
  }
}

export {};