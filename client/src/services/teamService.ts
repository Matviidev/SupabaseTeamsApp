import apiClient from "@/lib/apiClient";
import type { Team } from "@/types/team.type";
import type { Profile } from "@/types/user.type";

export const createTeam = async (name: string) => {
  try {
    const response = await apiClient.post<Team>("/teams", { name });
    return response;
  } catch (error: any) {
    console.error("Failed to create team:", {
      message: error?.message,
      status: error?.response?.status,
      details: error?.response?.data,
    });
    throw error;
  }
};

export const leaveTeam = async () => {
  try {
    const response = await apiClient.patch("/teams/leave");
    return response.data;
  } catch (error: any) {
    console.error("Failed to leave team:", {
      message: error?.message,
      status: error?.response?.status,
      details: error?.response?.data,
    });
    throw error;
  }
};

export const getTeam = async (id: string) => {
  try {
    const response = await apiClient.get<Team>(`/teams/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Failed to get team:", {
      message: error?.message,
      status: error?.response?.status,
      details: error?.response?.data,
    });
    throw error;
  }
};

export const joinTeam = async (code: string) => {
  try {
    const response = await apiClient.post<Profile>("/teams/join", { code });
    return response;
  } catch (error: any) {
    console.error("Failed to join team:", {
      message: error?.message,
      status: error?.response?.status,
      details: error?.response?.data,
    });
    throw error;
  }
};
