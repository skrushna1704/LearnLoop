import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    if (!config.headers || typeof config.headers === 'undefined') {
      config.headers = {} as unknown as import('axios').AxiosRequestHeaders;
    }
    (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }
  return config;  
}); 