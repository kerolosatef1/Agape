export const queryKeys = {
  me: ["auth", "me"] as const,
  organizations: ["organizations"] as const,
  members: ["members", "pending-members", "approved-members"] as const,
  users: ["users"] as const,
  roles: ["roles"] as const,
  settings: ["settings"] as const,
  dashboard: ["dashboard"] as const,
};
