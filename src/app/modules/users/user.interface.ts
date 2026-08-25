export type TUserRole = "donor" | "moderator" | "admin";

export interface IUser {
  email: string;
  role: TUserRole;
  status?: string;
  isDeleted?: boolean;
  created_at?: string;
  updated_at?: string;
  last_log_in?: string;
}
