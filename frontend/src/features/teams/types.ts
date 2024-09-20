interface Team {
  name: string;
  registrationDate: string;
  group: number;
}

export interface CreateTeamsRequest {
  teams: Team[];
  userId: string;
}

export interface CreateTeamsResponse {
  id: string;
  name: string;
  registrationDate: string;
  groupId: string;
  createdById: string;
  createdAt: string;
  updatedById: string | null;
  updatedAt: string;
}

export interface TeamAndGroupResponse {
  id: string;
  name: string;
  registrationDate: string;
  groupId: string;
  createdById: string;
  createdAt: string;
  updatedById: string | null;
  updatedAt: Date;
  group: {
    id: string;
    groupNumber: number;
    userId: string;
  };
}
