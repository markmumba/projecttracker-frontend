import axios from "axios";

const isDevelopment = process.env.NODE_ENV === 'development';

export const axiosInstance = axios.create({
  baseURL: isDevelopment
    ? 'http://localhost:8080' // Replace with your local backend URL
    : process.env.NEXT_PUBLIC_BACKEND_API_URL || process.env.NEXT_BACKEND_API_URL,
});

const fetcher = async (url: string) => {
  const response = await axiosInstance.get(url, {
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};

export default fetcher;
