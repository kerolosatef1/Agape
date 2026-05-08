export interface IClass {
  classId: number;
  className: string;
  classSerialNo: number;
}

export interface IAddClassPayload {
  className: string;
  classSerialNo: number;
}

export interface IUpdateClassPayload {
  className: string;
  classSerialNo: number;
}

export interface IClassUser {
  userId: string;
  name: string;
  userName: string;
  roles: string[];
}

export interface IAddClassUserPayload {
  userId: string;
  classId: number;
}

export interface IDeleteClassUserPayload {
  userId: string;
  classId: number;
}