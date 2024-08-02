import axios from "axios";
import { useAuthStore } from "../shared/store";

const isDevelopment = process.env.NODE_ENV === 'development';

export const axiosInstance = axios.create({
  baseURL: isDevelopment
    ? 'http://localhost:8080'
    : process.env.NEXT_PUBLIC_BACKEND_API_URL || process.env.NEXT_BACKEND_API_URL,
  withCredentials: true,
  headers :{
    "Content-Type":"application/json"
  }
});

axiosInstance.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken && typeof accessToken === 'string') {
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }
  return config;
});



axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await axiosInstance.post('/refresh-token');
        useAuthStore.getState().setAccessToken(data.accessToken);
        originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().setAccessToken(null);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const fetcher = async (url: string) => {
  const response = await axiosInstance.get(url);
  return response.data;
};


export default fetcher;