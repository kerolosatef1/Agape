export interface IBudgetAdd {
  budgetAddId: number;
  organizationId: string;
  adminName: string;
  volunteerName: string;
  description: string;
  moneyAdd: number;
  date: string;
  seasonId: number;
}

export interface IAddBudgetPayload {
  volunteerName: string;
  description: string;
  moneyAdd: number;
}

export interface IEditBudgetPayload {
  volunteerName: string;
  description: string;
  moneyAdd: number;
}