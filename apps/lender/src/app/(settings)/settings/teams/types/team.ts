export type MemberStatus = "Active" | "Invited";

export interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  status: MemberStatus;
}

export interface Role {
  name: string;
  description: string;
  permissionCount: number;
}
