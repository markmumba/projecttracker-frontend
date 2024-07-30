import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:  process.env.NEXT_PUBLIC_BACKEND_API_URL || process.env.NEXT_BACKEND_API_URL ,
});

const fetcher = async (url: string) => {
  const response = await axiosInstance.get(url, {
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};

export default fetcher;
