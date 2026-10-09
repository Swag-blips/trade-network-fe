import { mutation } from "@/api/client";
import type {
  CreateAccountData,
  CreateAccountDto,
  SignUpRequest,
} from "../types";

/** The form asks for one address, which serves as both login and company email. */
function toSignUpRequest({
  email,
  firstName,
  lastName,
}: CreateAccountDto): SignUpRequest {
  return {
    emailAddress: email,
    companyEmailAddress: email,
    firstName,
    lastName,
    accountType: "LENDER",
  };
}

export const createAccountService = {
  createAccount(fields: CreateAccountDto) {
    return mutation<CreateAccountData>(
      "/onboard/signup",
      "post",
      toSignUpRequest(fields),
    );
  },
};
