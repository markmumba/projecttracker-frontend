import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:  "http://localhost:8080" ,
});

const fetcher = async (url: string) => {
  const response = await axiosInstance.get(url, {
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};

export default fetcher;
