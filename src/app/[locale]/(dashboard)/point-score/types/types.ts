export interface IPointScore {
  setPointScoreId: number;
  name: string;
  topicScore: number;
  preparationScore: number;
  visitScore: number;
  attendClassScore: number;
  attendVolunteersMeetingScore: number;
  festivalwinScore: number;
  functionScore: number;
  festivalwinIsLeadScore: number;
  isActive: boolean;
  date: string;
  organizationId: string;
  seasonId: number;
}

export interface IPointScorePayload {
  name: string;
  topicScore: number;
  preparationScore: number;
  visitScore: number;
  attendClassScore: number;
  attendVolunteersMeetingScore: number;
  festivalwinScore: number;
  functionScore: number;
  festivalwinIsLeadScore: number;
}