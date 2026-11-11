export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  /** E.164, e.g. "+2348012345678". */
  phone: string | null;
}

export type UserRequest = Pick<User, "firstName" | "lastName" | "phone">;
