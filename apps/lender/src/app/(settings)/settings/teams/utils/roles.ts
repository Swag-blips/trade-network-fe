import type { Role } from "../types/team";

// Counts mirror LENDER_ROLE_PERMISSIONS in trade-network-be; there is no roles endpoint yet.
export const SYSTEM_ROLES: Role[] = [
  {
    name: "Owner",
    description:
      "Full access to capital allocation, funding mandates, offers, disbursements, portfolio, and team settings.",
    permissionCount: 13,
  },
  {
    name: "Admin",
    description:
      "Manages the lender workspace, team access, opportunities, and financing operations.",
    permissionCount: 13,
  },
  {
    name: "Investment Manager",
    description:
      "Reviews opportunities, requests documents, negotiates terms, and manages financing offers.",
    permissionCount: 10,
  },
  {
    name: "Portfolio Manager",
    description:
      "Monitors funded facilities, repayment schedules, overdue loans, and portfolio performance.",
    permissionCount: 6,
  },
  {
    name: "Finance Officer",
    description:
      "Manages disbursement records, verifies payments, and reconciles financing transactions.",
    permissionCount: 7,
  },
  {
    name: "Viewer",
    description:
      "Can view authorized opportunities and portfolio records without making changes.",
    permissionCount: 5,
  },
];
