export type AuthUser = {
  id: string;
  email: string;
  display_name: string;
};

export type RegisterPayload = {
  email: string;
  display_name: string;
  password: string;
};

export type TokenResponse = {
  access_token: string;
  token_type: 'bearer';
};
