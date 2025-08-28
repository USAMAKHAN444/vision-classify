import { config, getCategorizeUrl } from './config';

export const API_CONFIG = {
  // OCR Categorization endpoint
  OCR_CATEGORIZE: getCategorizeUrl(),
  
  // Base API configuration
  TIMEOUT: config.api.timeout,
  RETRY_ATTEMPTS: config.api.retryAttempts,
};

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: Response
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const apiClient = {
  async post<T>(url: string, data: FormData | any, options: RequestInit = {}): Promise<T> {
    let lastError: ApiError;
    
    for (let attempt = 1; attempt <= API_CONFIG.RETRY_ATTEMPTS; attempt++) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

      try {
        const response = await fetch(url, {
          method: 'POST',
          body: data,
          signal: controller.signal,
          ...options,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new ApiError(
            `HTTP error! status: ${response.status}`,
            response.status,
            response
          );
        }

        return await response.json();
      } catch (error) {
        clearTimeout(timeoutId);
        
        if (error instanceof ApiError) {
          lastError = error;
          
          // Don't retry on client errors (4xx)
          if (error.status && error.status >= 400 && error.status < 500) {
            throw error;
          }
        } else if (error.name === 'AbortError') {
          lastError = new ApiError('Request timeout');
        } else {
          lastError = new ApiError(error instanceof Error ? error.message : 'Network error');
        }
        
        // If this is the last attempt, throw the error
        if (attempt === API_CONFIG.RETRY_ATTEMPTS) {
          throw lastError;
        }
        
        // Wait before retrying (exponential backoff)
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError!;
  },

  async get<T>(url: string, options: RequestInit = {}): Promise<T> {
    let lastError: ApiError;
    
    for (let attempt = 1; attempt <= API_CONFIG.RETRY_ATTEMPTS; attempt++) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

      try {
        const response = await fetch(url, {
          method: 'GET',
          signal: controller.signal,
          ...options,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new ApiError(
            `HTTP error! status: ${response.status}`,
            response.status,
            response
          );
        }

        return await response.json();
      } catch (error) {
        clearTimeout(timeoutId);
        
        if (error instanceof ApiError) {
          lastError = error;
          
          // Don't retry on client errors (4xx)
          if (error.status && error.status >= 400 && error.status < 500) {
            throw error;
          }
        } else if (error.name === 'AbortError') {
          lastError = new ApiError('Request timeout');
        } else {
          lastError = new ApiError(error instanceof Error ? error.message : 'Network error');
        }
        
        // If this is the last attempt, throw the error
        if (attempt === API_CONFIG.RETRY_ATTEMPTS) {
          throw lastError;
        }
        
        // Wait before retrying (exponential backoff)
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError!;
  },

  // Utility method to check if an error is retryable
  isRetryableError(error: ApiError): boolean {
    if (!error.status) return true; // Network errors are retryable
    
    // Don't retry client errors (4xx)
    if (error.status >= 400 && error.status < 500) return false;
    
    // Retry server errors (5xx) and network errors
    return error.status >= 500 || error.status === 0;
  },

  // Utility method to get user-friendly error messages
  getErrorMessage(error: ApiError): string {
    if (error.status === 0) return 'Network error - please check your connection';
    if (error.status === 401) return 'Authentication required';
    if (error.status === 403) return 'Access denied';
    if (error.status === 404) return 'Service not found';
    if (error.status === 429) return 'Too many requests - please try again later';
    if (error.status >= 500) return 'Server error - please try again later';
    
    return error.message || 'An unexpected error occurred';
  }
};
