/* ─── Auth API Response ─── */
export interface IAuthResponse {
  message: string | null;
  isAuthenticated: boolean;
  userName: string;
  email: string;
  organizationId: string;
  roles: string[];
  expiresOn: string;
  token: string;
}

/* ─── Login ─── */
export interface ILoginFormData {
  username: string;
  password: string;
}

/* ─── Register Organization ─── */
export interface IRegisterOrgFormData {
  nameOrganization: string;
  name: string;
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

/* ─── Register User (under org) ─── */
export interface IRegisterUserFormData {
  name: string;
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

/* ─── Change Organization ─── */
export interface IChangeOrgFormData {
  userName: string;
  password: string;
  organizationId: string;
}

/* ─── Organization ─── */
export interface IOrganization {
  id: string;
  name: string;
}

/* ─── User (from session/token) ─── */
export interface IUser {
  userName: string;
  email: string;
  organizationId: string;
  roles: string[];
  token: string;
  expiresOn: string;
  isAuthenticated: boolean;
}

/* ─── Redux State ─── */
export interface IAuthState {
  userData: IUser | null;
  currentOrganization: IOrganization | null;
}