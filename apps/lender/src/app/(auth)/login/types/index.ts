export interface LoginDto {
  email: string;
}

export interface LoginRequest {
  // this should be email but the backend guy used username, maybe he was trying to achieve security by obscurity :(
  username: string;
}

export interface LoginData {
  // Could potentially be an HTTP cookie, but bro decided to return as body
  sessionToken: string;
}
