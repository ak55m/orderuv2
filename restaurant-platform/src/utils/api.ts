import { NetworkError, AuthError, ValidationError, NotFoundError, errorMap, userFriendlyMessages, logError } from './errors';

const API_URL = process.env.NEXT_PUBLIC_SERVER_API_URL;
const TIMEOUT_DURATION = 30000; // 30 seconds
const MAX_RETRIES = 3;

// Cache implementation
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Queue for offline requests
const offlineQueue: Array<() => Promise<void>> = [];
let isOnline = true;

// Check online status
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    isOnline = true;
    processOfflineQueue();
  });
  window.addEventListener('offline', () => {
    isOnline = false;
  });
}

// Process offline queue
const processOfflineQueue = async () => {
  while (offlineQueue.length > 0 && isOnline) {
    const request = offlineQueue.shift();
    if (request) {
      try {
        await request();
      } catch (error) {
        logError(error as Error, 'Offline queue processing');
      }
    }
  }
};

// Retry logic with exponential backoff
const retryWithBackoff = async (fn: () => Promise<any>, retries = MAX_RETRIES) => {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) throw error;
    const delay = Math.pow(2, MAX_RETRIES - retries) * 1000;
    await new Promise(resolve => setTimeout(resolve, delay));
    return retryWithBackoff(fn, retries - 1);
  }
};

// Get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Main API request function
export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {},
  useCache = false
): Promise<T> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_DURATION);

  // Check cache
  if (useCache) {
    const cached = cache.get(endpoint);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
  }

  const makeRequest = async () => {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
          ...getAuthHeaders(),
          ...options.headers,
        },
        signal: controller.signal,
      });

      // Handle different status codes
      if (!response.ok) {
        const ErrorClass = errorMap[response.status as keyof typeof errorMap] || NetworkError;
        const data = await response.json();
        throw new ErrorClass(data.message || userFriendlyMessages[ErrorClass.name as keyof typeof userFriendlyMessages]);
      }

      const data = await response.json();

      // Cache successful responses
      if (useCache) {
        cache.set(endpoint, { data, timestamp: Date.now() });
      }

      return data;
    } catch (error) {
      if (error instanceof AuthError) {
        // Handle auth errors
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/auth';
      }

      if (!isOnline) {
        // Queue request for offline
        return new Promise((resolve, reject) => {
          offlineQueue.push(() => makeRequest().then(resolve).catch(reject));
        });
      }

      logError(error as Error, { endpoint, options });
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  };

  return retryWithBackoff(makeRequest);
};

// Cleanup function for unmounted components
export const cleanup = () => {
  cache.clear();
  offlineQueue.length = 0;
}; 