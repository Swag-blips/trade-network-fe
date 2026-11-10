import { mutation } from "@/api/client";
import type { CreateAccountData, CreateAccountDto } from "../types";

export const createAccountService = {
  createAccount({ email, firstName, lastName }: CreateAccountDto) {
    return mutation<CreateAccountData>("/auth/signup", "post", {
      email,
      firstName,
      lastName,
    });
  },
};
