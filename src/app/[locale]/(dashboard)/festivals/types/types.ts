// ═══ Church Festival ═══
export interface IChurchFestival {
  churchFestivalId: number;
  churchFestivalName: string;
}

// ═══ Classification ═══
export interface IClassification {
  classificationFestivalFamilyId: number;
  classificationName: string;
}

// ═══ Festival Family (Team) ═══
// ═══ Festival Family (Team) ═══
export interface IFestivalFamily {
  festivalFamilyId: number;
  festivalFamilyName: string;
  churchFestivalId: number;
  classificationId: number;
  winStatus: number; // 0 = not winner, 1 = winner
}

// ═══ Payloads ═══
export interface IAddFamilyPayload {
  churchFestivalId: number;
  classificationId: number;  // NOT classificationFestivalFamilyId
  festivalFamilyName: string;
}

export interface IAddFestivalUserPayload {
  festivalFamilyId: number;
  userId: string;  
}

// ═══ Festival User ═══
export interface IFestivalUser {
  festivalUserId: number;
  userId: string;
  festivalFamilyId: number;
  isLead: boolean;
}

// ═══ Point Score ═══
export interface IPointScore {
  pointScoreId: number;
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
}

// ═══ Payloads ═══
export interface IAddFestivalPayload {
  churchFestivalName: string;
}
export interface IAddClassificationPayload {
  classificationName: string;
}


export interface IEditFestivalUserPayload {
  userId: string;
  festivalFamilyId: number;
  isLead: boolean;
}
export interface IAddPointScorePayload {
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

// ═══ Festival Tabs ═══
export type FestivalTab =
  | "festivals"
  | "classifications"
  | "teams"
  | "members"
  | "points";
