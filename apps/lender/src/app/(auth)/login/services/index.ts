import { mutation } from "@/api/client";
import type { LoginData, LoginDto } from "../types";

export const loginService = {
  login({ email }: LoginDto) {
    return mutation<LoginData>("/auth/login", "post", { email });
  },
};
