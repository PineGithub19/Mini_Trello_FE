export type AccessTokenPayload = {
  sub: number;
  exp: number;
  roles: string[];
};

export type AuthResponse = ApiResponse<{
  access_token: string;
  refresh_token: string;
}>;
