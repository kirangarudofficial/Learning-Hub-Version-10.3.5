import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  correlationId?: string;
  timestamp: string;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

// API Client Class
class ApiClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
    this.loadTokenFromStorage();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }

        // Add correlation ID
        config.headers['X-Correlation-ID'] = this.generateCorrelationId();

        // Add request timestamp
        config.metadata = { startTime: Date.now() };

        console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, {
          params: config.params,
          data: config.data,
        });

        return config;
      },
      (error) => {
        console.error('[API] Request error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        const duration = Date.now() - (response.config.metadata?.startTime || 0);

        console.log(`[API] ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url} (${duration}ms)`, {
          data: response.data,
          correlationId: response.headers['x-correlation-id'],
        });

        return response;
      },
      async (error) => {
        const duration = Date.now() - (error.config?.metadata?.startTime || 0);

        console.error(`[API] ${error.response?.status || 'NETWORK'} ${error.config?.method?.toUpperCase()} ${error.config?.url} (${duration}ms)`, {
          error: error.response?.data || error.message,
          correlationId: error.response?.headers['x-correlation-id'],
        });

        // Handle token expiration
        if (error.response?.status === 401 && this.token) {
          this.clearToken();
          // Dispatch logout event
          window.dispatchEvent(new CustomEvent('auth:logout'));
        }

        // Handle network errors
        if (!error.response) {
          throw new Error('Network error. Please check your connection.');
        }

        // Handle rate limiting
        if (error.response.status === 429) {
          const retryAfter = error.response.headers['retry-after'] || 60;
          throw new Error(`Rate limit exceeded. Please try again in ${retryAfter} seconds.`);
        }

        throw error;
      }
    );
  }

  private generateCorrelationId(): string {
    return `web-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  }

  private loadTokenFromStorage() {
    try {
      const stored = localStorage.getItem('auth_token');
      if (stored) {
        this.token = stored;
      }
    } catch (error) {
      console.warn('[API] Failed to load token from storage:', error);
    }
  }

  public setToken(token: string) {
    this.token = token;
    try {
      localStorage.setItem('auth_token', token);
    } catch (error) {
      console.warn('[API] Failed to save token to storage:', error);
    }
  }

  public clearToken() {
    this.token = null;
    try {
      localStorage.removeItem('auth_token');
    } catch (error) {
      console.warn('[API] Failed to remove token from storage:', error);
    }
  }

  public getToken(): string | null {
    return this.token;
  }

  // Generic API methods
  public async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.get(url, config);
    return response.data;
  }

  public async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.post(url, data, config);
    return response.data;
  }

  public async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.put(url, data, config);
    return response.data;
  }

  public async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.patch(url, data, config);
    return response.data;
  }

  public async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.delete(url, config);
    return response.data;
  }

  // Health check
  public async healthCheck(): Promise<ApiResponse> {
    return this.get('/health');
  }

  // Upload files
  public async uploadFile(file: File, onProgress?: (progress: number) => void): Promise<ApiResponse<{ url: string }>> {
    const formData = new FormData();
    formData.append('file', file);

    // Align with backend README: /api/media/upload/single
    return this.post('/media/upload/single', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });
  }
}

// Create singleton instance
const apiClient = new ApiClient();

export default apiClient;

// Export specific API methods for different modules
export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),

  register: (name: string, email: string, password: string) =>
    apiClient.post('/auth/register', { name, email, password }),

  refreshToken: (refreshToken: string) =>
    apiClient.post('/auth/refresh', { refreshToken }),

  getCurrentUser: () =>
    apiClient.get('/auth/me'),

  logout: () =>
    apiClient.post('/auth/logout'),

  verifyToken: () =>
    apiClient.get('/auth/verify'),
};

export const coursesApi = {
  getAllCourses: (params?: PaginationParams) =>
    apiClient.get<any[]>('/courses', { params }),

  getCourseById: (id: string) =>
    apiClient.get(`/courses/${id}`),

  getCoursesByCategory: (category: string, params?: PaginationParams) =>
    apiClient.get<any[]>(`/courses/category/${category}`, { params }),

  createCourse: (courseData: any) =>
    apiClient.post('/courses', courseData),

  updateCourse: (id: string, courseData: any) =>
    apiClient.put(`/courses/${id}`, courseData),

  deleteCourse: (id: string) =>
    apiClient.delete(`/courses/${id}`),

  getInstructorCourses: () =>
    apiClient.get('/courses/instructor/my-courses'),
};

export const usersApi = {
  getProfile: () =>
    apiClient.get('/users/profile'),

  updateProfile: (profileData: any) =>
    apiClient.put('/users/profile', profileData),

  getUserById: (id: string) =>
    apiClient.get(`/users/${id}`),

  getAllUsers: (params?: PaginationParams) =>
    apiClient.get<any[]>('/users', { params }),
};

export const enrollmentsApi = {
  enrollInCourse: (courseId: string) =>
    apiClient.post(`/enrollments/enroll/${courseId}`),

  getUserEnrollments: () =>
    apiClient.get('/enrollments/my-courses'),

  getEnrollmentProgress: (courseId: string) =>
    apiClient.get(`/enrollments/${courseId}/progress`),

  updateProgress: (courseId: string, progressData: { lessonId: string, completed: boolean }) =>
    apiClient.put(`/enrollments/${courseId}/progress`, progressData),
};

export const paymentsApi = {
  createPaymentIntent: (data: { courseId: string; currency: string }) =>
    apiClient.post('/payments/create-payment-intent', data),

  confirmPayment: (data: { paymentIntentId: string }) =>
    apiClient.post('/payments/confirm-payment', data),

  getPaymentHistory: (params?: PaginationParams) =>
    apiClient.get<any[]>('/payments/history', { params }),
};

export const mediaApi = {
  uploadFile: (file: File, onProgress?: (progress: number) => void) =>
    apiClient.uploadFile(file, onProgress),

  deleteFile: (fileId: string) =>
    apiClient.delete(`/media/${fileId}`),

  getFileInfo: (fileId: string) =>
    apiClient.get(`/media/${fileId}`),
};

// Utility functions
export const handleApiError = (error: any): string => {
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred. Please try again.';
};

export const isApiResponse = (obj: any): obj is ApiResponse => {
  return obj && typeof obj === 'object' && 'success' in obj && 'timestamp' in obj;
};

export const isPaginatedResponse = (obj: any): obj is PaginatedResponse => {
  return isApiResponse(obj) && 'pagination' in obj;
};

// Export the client instance as default
export { apiClient };