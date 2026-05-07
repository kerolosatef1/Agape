export interface IAttendance {
  attendanceChiledId: number;
  chiledId: number;
  attend: boolean;
  organizationId: string;
  seasonId: number;
  date: string;
}

export interface IAddAttendancePayload {
  chiledId: number;
  attend: boolean;
}

export interface IEditAttendancePayload {
  chiledId: number;
  attend: boolean;
}