export interface ICommitteeSocial {
  phone?: string;
  whatsapp?: string;
  facebook?: string;
  email?: string;
}

export interface ICommitteeMember {
  name: string;
  title: string; // e.g. President, General Secretary, Senior Vice President
  image: string; // Image URL (e.g. from ImgBB)
  session?: string; // e.g. "2026-2027" or "2024-2025"
  says?: string; // Speech / Bio / Statement
  social?: ICommitteeSocial;
  order?: number; // Sorting order (1, 2, 3...)
  isActive?: boolean;
}

export interface ICommitteeQueryParams {
  search?: string;
  session?: string;
  isActive?: string;
  sortField?: string;
  sortOrder?: "asc" | "desc";
}
