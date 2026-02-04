import apiClient from "@/lib/apiClient";

export const getProfile = async () => {
  try {
    const { data } = await apiClient.get("/users/me");
    return data;
  } catch (error: any) {
    console.error("Failed to fetch profile:", {
      message: error?.message,
      status: error?.response?.status,
      details: error?.response?.data,
    });
    throw error;
  }
};
