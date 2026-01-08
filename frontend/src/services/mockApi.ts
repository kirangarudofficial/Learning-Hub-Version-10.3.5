import { ApiResponse } from './api';
import { User } from '../types';
import { UserRole } from '../types/roles';

// Mock user data
const mockUsers: User[] = [
  {
    id: '1',
    email: 'user@example.com',
    name: 'Demo User',
    avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=0D8ABC&color=fff',
    role: 'USER' as UserRole,
    enrolledCourses: ['course1', 'course2'],
    createdAt: new Date()
  },
  {
    id: '2',
    email: 'instructor@example.com',
    name: 'Demo Instructor',
    avatar: 'https://ui-avatars.com/api/?name=Demo+Instructor&background=FF5722&color=fff',
    role: 'INSTRUCTOR' as UserRole,
    enrolledCourses: [],
    createdAt: new Date()
  },
  {
    id: '3',
    email: 'admin@example.com',
    name: 'Admin User',
    avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=4CAF50&color=fff',
    role: 'ADMIN' as UserRole,
    enrolledCourses: [],
    createdAt: new Date()
  }
];

// Create a successful response
const successResponse = <T>(data: T): ApiResponse<T> => ({
  success: true,
  data,
  message: 'Operation successful',
  timestamp: new Date().toISOString()
});

// Create an error response
const errorResponse = (message: string): ApiResponse => ({
  success: false,
  error: message,
  timestamp: new Date().toISOString()
});

// Mock Auth API
export const mockAuthApi = {
  login: async (email: string, password: string): Promise<ApiResponse<{ accessToken: string; user: User }>> => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    
    const user = mockUsers.find(u => u.email === email);
    
    if (!user || password !== 'password') {
      return errorResponse('Invalid email or password');
    }
    
    return successResponse({
      accessToken: 'mock-jwt-token',
      user
    });
  },
  
  register: async (name: string, email: string, password: string): Promise<ApiResponse<{ accessToken: string; user: User }>> => {
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
    
    if (mockUsers.some(u => u.email === email)) {
      return errorResponse('Email already in use');
    }
    
    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      name,
      avatar: `https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=0D8ABC&color=fff`,
      role: 'USER' as UserRole,
      enrolledCourses: [],
      createdAt: new Date()
    };
    
    return successResponse({
      accessToken: 'mock-jwt-token',
      user: newUser
    });
  },
  
  refreshToken: async (): Promise<ApiResponse<{ accessToken: string }>> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return successResponse({ accessToken: 'new-mock-jwt-token' });
  },
  
  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Simulate a stored user in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        return successResponse(user);
      } catch (error) {
        return errorResponse('Invalid user data');
      }
    }
    
    return errorResponse('User not authenticated');
  },
  
  logout: async (): Promise<ApiResponse<void>> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return successResponse(undefined);
  },
  
  verifyToken: async (): Promise<ApiResponse<boolean>> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return successResponse(true);
  }
};

// Export other mock APIs here as needed (courses, users, etc.)