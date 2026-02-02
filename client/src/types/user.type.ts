export interface Profile {
  id: string;
  fullName: string;
  avatarUrl: string | null;
  teamId: string | null;
}

export interface User {
  id: string;
  email: string;
  profile: Profile;
}

export interface GetProfileResponse {
  user: User;
}

export interface AuthResponse {
  token: string;
}

export interface Team {
  id: string;
  name: string;
  inviteCode: string;
  members: User[];
  createdAt: string;
}

