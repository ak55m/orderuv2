import { apiRequest } from '@/utils/api';

const API_URL = process.env.NEXT_PUBLIC_SERVER_API_URL;

interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
    restaurantId: string;
  };
}

interface SubscriptionResponse {
  isActive: boolean;
  subscriptionStatus: string;
  subscriptionCurrentPeriodEnd: string;
  stripeSubscriptionId?: string;
  lastPaymentStatus?: string;
  lastPaymentDate?: Date | null;
  lastPaymentAmount?: number | null;
}

interface CheckoutSessionResponse {
  url: string;
}

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Helper for protected API requests
const protectedRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  if (response.status === 401) {
    // Token is invalid or expired
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/auth';
    throw new Error('Session expired. Please login again.');
  }

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Request failed');
  }

  return response.json();
};

export const restaurantApi = {
  // Public routes
  checkEmail: async (email: string): Promise<{ exists: boolean }> => {
    return apiRequest('/api/user/check-email', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  merchantLogin: async (email: string, password: string): Promise<AuthResponse> => {
    return apiRequest('/api/user/merchant-login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  merchantRegister: async (email: string, password: string): Promise<AuthResponse> => {
    return apiRequest('/api/user/merchant-register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  // Protected routes
  getRestaurantDetails: async () => {
    return apiRequest('/api/restaurant/details', {
      method: 'GET',
    }, true); // Use cache for GET requests
  },

  updateRestaurantDetails: async (data: any) => {
    return apiRequest('/api/restaurant/update', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  checkSubscription: async (): Promise<SubscriptionResponse> => {
    return apiRequest<SubscriptionResponse>('/api/merchant/subscription', {
      method: 'GET',
    });
  },

  createCheckoutSession: async (): Promise<CheckoutSessionResponse> => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return protectedRequest('/api/sub/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        restaurantId: user.restaurantId
      })
    });
  },

  createCustomerPortalSession: async () => {
    return protectedRequest('/api/sub/create-portal-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });
  },

  deleteAccount: async () => {
    return protectedRequest('/api/user/delete-account', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });
  },

  // Add more protected routes here...
}; 