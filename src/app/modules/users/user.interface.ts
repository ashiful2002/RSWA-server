export type TUserRole = "super_admin" | "admin" | "moderator" | "donor";

export interface IUser {
  email: string;
  role: TUserRole;
  displayName?: string;
  name?: string;
  photoURL?: string;
  status?: string;
  isDeleted?: boolean;
  created_at?: string;
  updated_at?: string;
  last_log_in?: string;
}
