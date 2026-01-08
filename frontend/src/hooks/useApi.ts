import { useState, useCallback } from 'react';
import { handleApiError } from '../services/api';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiOptions<T> {
  initialData?: T;
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
}

export const useApi = <T = any>(options: UseApiOptions<T> = {}) => {
  const { initialData = null, onSuccess, onError } = options;
  
  const [state, setState] = useState<UseApiState<T>>({
    data: initialData,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (apiCall: () => Promise<any>) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await apiCall();
      
      if (response.success) {
        setState(prev => ({ ...prev, data: response.data, loading: false }));
        if (onSuccess) onSuccess(response.data);
        return response.data;
      } else {
        throw new Error(response.error || 'API call failed');
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      if (onError) onError(errorMessage);
      throw error;
    }
  }, [onSuccess, onError]);

  const reset = useCallback(() => {
    setState({ data: initialData, loading: false, error: null });
  }, [initialData]);

  const setData = useCallback((data: T) => {
    setState(prev => ({ ...prev, data }));
  }, []);

  const setError = useCallback((error: string) => {
    setState(prev => ({ ...prev, error, loading: false }));
  }, []);

  return {
    ...state,
    execute,
    reset,
    setData,
    setError,
    isLoading: state.loading,
    hasError: !!state.error,
    hasData: !!state.data,
  };
};

// Specialized hooks for common patterns
export const useAsyncApi = <T = any>(
  apiCall: () => Promise<any>,
  dependencies: any[] = [],
  options: UseApiOptions<T> = {}
) => {
  const api = useApi<T>(options);

  const refresh = useCallback(() => {
    return api.execute(apiCall);
  }, [api, apiCall]);

  // Auto-execute on dependency changes
  useState(() => {
    refresh();
  });

  return {
    ...api,
    refresh,
  };
};

export const useMutation = <T = any, P = any>(
  mutationFn: (params: P) => Promise<any>,
  options: UseApiOptions<T> = {}
) => {
  const api = useApi<T>(options);

  const mutate = useCallback(async (params: P) => {
    return api.execute(() => mutationFn(params));
  }, [api, mutationFn]);

  return {
    ...api,
    mutate,
    isIdle: !api.loading && !api.error,
    isSuccess: !api.loading && !api.error && api.data !== null,
  };
};

// Hook for handling form submissions
export const useFormSubmission = <T = any>(
  submitFn: (data: any) => Promise<any>,
  options: UseApiOptions<T> & {
    resetOnSuccess?: boolean;
  } = {}
) => {
  const { resetOnSuccess = false, ...apiOptions } = options;
  const api = useApi<T>(apiOptions);

  const submit = useCallback(async (formData: any) => {
    try {
      const result = await api.execute(() => submitFn(formData));
      if (resetOnSuccess) {
        api.reset();
      }
      return result;
    } catch (error) {
      throw error;
    }
  }, [api, submitFn, resetOnSuccess]);

  return {
    ...api,
    submit,
    isSubmitting: api.loading,
    isSuccess: !api.loading && !api.error && api.data !== null,
  };
};

// Hook for pagination
export const usePagination = (initialPage = 1, initialLimit = 10) => {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const nextPage = useCallback(() => setPage(prev => prev + 1), []);
  const prevPage = useCallback(() => setPage(prev => Math.max(1, prev - 1)), []);
  const goToPage = useCallback((newPage: number) => setPage(Math.max(1, newPage)), []);
  const changeLimit = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when changing limit
  }, []);

  const reset = useCallback(() => {
    setPage(initialPage);
    setLimit(initialLimit);
  }, [initialPage, initialLimit]);

  return {
    page,
    limit,
    nextPage,
    prevPage,
    goToPage,
    changeLimit,
    reset,
    offset: (page - 1) * limit,
  };
};

// Hook for debounced API calls (useful for search)
export const useDebounce = (value: any, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useState(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  });

  return debouncedValue;
};

export const useDebouncedApi = <T = any>(
  apiCall: (value: any) => Promise<any>,
  delay = 500,
  options: UseApiOptions<T> = {}
) => {
  const [searchValue, setSearchValue] = useState('');
  const debouncedValue = useDebounce(searchValue, delay);
  const api = useApi<T>(options);

  const search = useCallback((value: string) => {
    setSearchValue(value);
  }, []);

  useState(() => {
    if (debouncedValue) {
      api.execute(() => apiCall(debouncedValue));
    }
  });

  return {
    ...api,
    search,
    searchValue,
    debouncedValue,
  };
};