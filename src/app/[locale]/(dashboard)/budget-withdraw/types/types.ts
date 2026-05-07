export interface IBudgetWithdraw {
  budgetWithdrawId: number;
  organizationId: string;
  adminName: string;
  volunteerName: string;
  description: string;
  withdraw: number;
  classId: number;
  date: string;
  seasonId: number;
}

export interface IAddBudgetWithdrawPayload {
  volunteerName: string;
  description: string;
  withdraw: number;
  classId: number;
}

export interface IEditBudgetWithdrawPayload {
  volunteerName: string;
  description: string;
  withdraw: number;
  classId: number;
}