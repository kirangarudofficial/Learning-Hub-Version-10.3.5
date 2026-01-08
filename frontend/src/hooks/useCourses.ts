import { useState, useEffect, useCallback } from 'react';
import { coursesApi, handleApiError, PaginationParams } from '../services/api';
import { Course } from '../types';

interface UseCoursesOptions {
  autoFetch?: boolean;
  category?: string;
  pagination?: PaginationParams;
}

interface CoursesState {
  courses: Course[];
  loading: boolean;
  error: string | null;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export const useCourses = (options: UseCoursesOptions = {}) => {
  const { autoFetch = true, category, pagination: initialPagination } = options;
  
  const [state, setState] = useState<CoursesState>({
    courses: [],
    loading: false,
    error: null,
  });

  const [pagination, setPagination] = useState<PaginationParams>(
    initialPagination || { page: 1, limit: 10 }
  );

  const fetchCourses = useCallback(async (params?: PaginationParams) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const paginationParams = params || pagination;
      let response;

      if (category) {
        response = await coursesApi.getCoursesByCategory(category, paginationParams);
      } else {
        response = await coursesApi.getAllCourses(paginationParams);
      }

      if (response.success && response.data) {
        setState(prev => ({
          ...prev,
          courses: response.data || [],
          loading: false,
          pagination: response.pagination,
        }));
      } else {
        throw new Error(response.error || 'Failed to fetch courses');
      }
    } catch (error) {
      console.error('[useCourses] Error fetching courses:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: handleApiError(error),
      }));
    }
  }, [category, pagination]);

  const searchCourses = useCallback(async (query: string) => {
    const searchParams = { ...pagination, search: query, page: 1 };
    setPagination(searchParams);
    await fetchCourses(searchParams);
  }, [fetchCourses, pagination]);

  const changePage = useCallback(async (page: number) => {
    const newPagination = { ...pagination, page };
    setPagination(newPagination);
    await fetchCourses(newPagination);
  }, [fetchCourses, pagination]);

  const changeLimit = useCallback(async (limit: number) => {
    const newPagination = { ...pagination, limit, page: 1 };
    setPagination(newPagination);
    await fetchCourses(newPagination);
  }, [fetchCourses, pagination]);

  const sortCourses = useCallback(async (sort: string, order: 'asc' | 'desc' = 'desc') => {
    const newPagination = { ...pagination, sort, order, page: 1 };
    setPagination(newPagination);
    await fetchCourses(newPagination);
  }, [fetchCourses, pagination]);

  const refreshCourses = useCallback(() => {
    return fetchCourses(pagination);
  }, [fetchCourses, pagination]);

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch) {
      fetchCourses();
    }
  }, [autoFetch, fetchCourses]);

  return {
    ...state,
    pagination: state.pagination,
    // Actions
    fetchCourses,
    searchCourses,
    changePage,
    changeLimit,
    sortCourses,
    refreshCourses,
    // Utilities
    isFirstPage: (state.pagination?.page || 1) === 1,
    isLastPage: !(state.pagination?.hasNext || false),
    totalPages: state.pagination?.pages || 0,
    currentPage: state.pagination?.page || 1,
  };
};

export const useCourse = (courseId: string | null) => {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCourse = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await coursesApi.getCourseById(id);
      
      if (response.success && response.data) {
        setCourse(response.data);
      } else {
        throw new Error(response.error || 'Failed to fetch course');
      }
    } catch (err) {
      console.error('[useCourse] Error fetching course:', err);
      setError(handleApiError(err));
      setCourse(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshCourse = useCallback(() => {
    if (courseId) {
      return fetchCourse(courseId);
    }
  }, [courseId, fetchCourse]);

  useEffect(() => {
    if (courseId) {
      fetchCourse(courseId);
    } else {
      setCourse(null);
      setError(null);
    }
  }, [courseId, fetchCourse]);

  return {
    course,
    loading,
    error,
    refreshCourse,
  };
};

export const useInstructorCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInstructorCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await coursesApi.getInstructorCourses();
      
      if (response.success && response.data) {
        setCourses(response.data);
      } else {
        throw new Error(response.error || 'Failed to fetch instructor courses');
      }
    } catch (err) {
      console.error('[useInstructorCourses] Error:', err);
      setError(handleApiError(err));
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const createCourse = useCallback(async (courseData: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await coursesApi.createCourse(courseData);
      
      if (response.success && response.data) {
        // Refresh the courses list
        await fetchInstructorCourses();
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to create course');
      }
    } catch (err) {
      console.error('[useInstructorCourses] Create error:', err);
      setError(handleApiError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchInstructorCourses]);

  const updateCourse = useCallback(async (courseId: string, courseData: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await coursesApi.updateCourse(courseId, courseData);
      
      if (response.success && response.data) {
        // Refresh the courses list
        await fetchInstructorCourses();
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to update course');
      }
    } catch (err) {
      console.error('[useInstructorCourses] Update error:', err);
      setError(handleApiError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchInstructorCourses]);

  const deleteCourse = useCallback(async (courseId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await coursesApi.deleteCourse(courseId);
      
      if (response.success) {
        // Refresh the courses list
        await fetchInstructorCourses();
      } else {
        throw new Error(response.error || 'Failed to delete course');
      }
    } catch (err) {
      console.error('[useInstructorCourses] Delete error:', err);
      setError(handleApiError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchInstructorCourses]);

  useEffect(() => {
    fetchInstructorCourses();
  }, [fetchInstructorCourses]);

  return {
    courses,
    loading,
    error,
    fetchInstructorCourses,
    createCourse,
    updateCourse,
    deleteCourse,
  };
};