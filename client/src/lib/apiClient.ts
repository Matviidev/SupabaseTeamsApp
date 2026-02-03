import axios from "axios";
import { useAuthStore } from "@/store/auth/useAuthStore";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_SUPABASE_FUNCTIONS_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(async (config) => {
  const session = useAuthStore.getState().session;
  const accessToken = session?.access_token;

  if (accessToken && config.headers) {
    config.headers = new axios.AxiosHeaders(config.headers);
    config.headers.set("Authorization", `Bearer ${accessToken}`);
  }

  return config;
});

export default apiClient;
