export type Team = {
  id: string;
  name: string;
  inviteCode: string;
  createdAt: string;
  updatedAt: string;
  users: Member[];
};

export type Member = {
  id: string;
  fullName: string;
  avatarUrl: string;
  isOnline: boolean;
  lastSeen: string;
};
