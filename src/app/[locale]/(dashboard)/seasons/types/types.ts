export interface ISeason {
  seasonId: number;
  seasonName: string;
  date: string;
  isActive: boolean;
}

export interface IAddSeasonPayload {
  name: string;
  password: string;
}

export interface IEditSeasonPayload {
  name: string;
  password: string;
}

export interface IActivateSeasonPayload {
  id: number;
  password: string;
}