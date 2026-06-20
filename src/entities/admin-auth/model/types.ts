export type AdminLoginRequest = {
  username: string;
  password: string;
};

export type AdminLoginResponse = {
  accessToken: string;
  role: "ADMIN";
};
