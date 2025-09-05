export enum IRole {
  ADMIN = "ADMIN",
  USER = "USER",
}

export enum IStatus {
  ACTIVE = "ACTIVE",
  SUSPENDED = "SUSPENDED",
}

export interface IUser {
  name: string;
  phoneNo: string;
  email?: string;
  role: IRole;
  address: string;
  password: string;
  status: IStatus;
  createdAt?: string;
  updatedAt?: string;
}
