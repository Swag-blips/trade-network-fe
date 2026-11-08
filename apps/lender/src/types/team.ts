export type MemberStatus = "Active" | "Pending" | "Expired" | "Deactivated";

export interface Member {
  id: string;
  /** Absent for an invitation. */
  userId?: string;
  /** Empty for an invitation: nobody has joined yet. */
  name: string;
  email: string;
  role: string;
  status: MemberStatus;
  invitation?: Invitation;
}

export interface MemberResponse {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: { id: string; name: string };
  joinedAt: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

export type InvitationStatus = "PENDING" | "EXPIRED";

export interface Invitation {
  id: string;
  email: string;
  role: { id: string; name: string };
  status: InvitationStatus;
  /** Null once the inviter's account is gone. */
  invitedBy: { id: string; name: string } | null;
  createdAt: string;
  expiresAt: string;
  lastSentAt: string;
}

export interface InviteRequest {
  email: string;
  roleId: string;
}
