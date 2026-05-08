
// Organization Profile (Admin)
export interface IOrganizationProfile {
  organizationId: string;
  organizationName: string;
  organizationImagePath: string | null;
}

// User Profile
export interface IUserProfile {
  name: string;
  email: string;
  userName: string;
  pathImg: string | null;
  rules: string[];
}