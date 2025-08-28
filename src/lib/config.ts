export const config = {
  // API Configuration
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://gb-ocr-stage.vertekx.com',
    endpoints: {
      categorize: '/categorize',
    },
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'),
    retryAttempts: parseInt(import.meta.env.VITE_API_RETRY_ATTEMPTS || '3'),
  },
  
  // App Configuration
  app: {
    name: 'Vision Classify Spark',
    version: '1.0.0',
    maxFileSize: parseInt(import.meta.env.VITE_MAX_FILE_SIZE || '10485760'), // 10MB default
    allowedFileTypes: (import.meta.env.VITE_ALLOWED_FILE_TYPES || 'image/*,.pdf,.doc,.docx').split(','),
  },
  
  // Feature Flags
  features: {
    enableRetry: import.meta.env.VITE_ENABLE_RETRY !== 'false',
    enableTimeout: import.meta.env.VITE_ENABLE_TIMEOUT !== 'false',
    enableProgress: import.meta.env.VITE_ENABLE_PROGRESS !== 'false',
  }
};

// Helper function to get full API URL
export const getApiUrl = (endpoint: string): string => {
  return `${config.api.baseUrl}${endpoint}`;
};

// Helper function to get categorize endpoint
export const getCategorizeUrl = (): string => {
  return getApiUrl(config.api.endpoints.categorize);
};
