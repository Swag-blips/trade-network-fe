import { mutationResponse } from "@/api/client";
import { LoginData, LoginDto, LoginRequest } from "../types";

export const loginService = {
  validateOtp({ email }: LoginDto) {
    const body: LoginRequest = { username: email };

    return mutationResponse<LoginData>("access/login", "post", body);
  },
};
