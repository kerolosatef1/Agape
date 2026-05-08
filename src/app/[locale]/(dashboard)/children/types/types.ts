export interface IChild {
  chiledId: number;
  chiledName: string;
  gender: boolean; // true = boy, false = girl
  description: string;
  typeNeedy: boolean;
  classId: number;
  organizationId: string;
}

export interface IAddChildPayload {
  chiledName: string;
  gender: boolean;
  description: string;
  typeNeedy: boolean;
  classId: number;
}

export interface IEditChildPayload {
  chiledName: string;
  gender: boolean;
  description: string;
  typeNeedy: boolean;
  classId: number;
}

// Roles that can manage children
export const CHILD_MANAGEMENT_ROLES = ["Admin", "AdminAssistant", "ClassOfficial"];