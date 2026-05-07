export interface IReceive {
  recieveId: number;
  classId: number;
  moneyAmount: number;
  recieveFrom: string;
  description: string;
  date: string;
  seasonId: number;
  organizationId: string;
}

export interface IAddReceivePayload {
  classId: number;
  moneyAmount: number;
  recieveFrom: string;
  description: string;
}

export interface IEditReceivePayload {
  classId: number;
  moneyAmount: number;
  recieveFrom: string;
  description: string;
}