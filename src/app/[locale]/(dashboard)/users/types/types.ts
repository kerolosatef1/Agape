export interface IManagedUser {
  id: string;
  name: string;
  userName: string;
  isApproved: boolean;
  withdraw: boolean;
  roles: string[];
}

export interface IAddRolePayload {
  userId: string;
  role: string;
}

export interface IRemoveRolePayload {
  userId: string;
  role: string;
}