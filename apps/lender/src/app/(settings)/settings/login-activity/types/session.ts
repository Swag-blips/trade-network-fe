export interface LoginSession {
  id: string;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  /** This browser. */
  current: boolean;
  active: boolean;
  endedAt: string | null;
}

export interface SessionPage {
  items: LoginSession[];
  nextCursor: string | null;
}
