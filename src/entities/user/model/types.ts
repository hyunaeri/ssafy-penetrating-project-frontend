export type UserRole = "CUSTOMER" | "OWNER" | "RIDER" | "ADMIN";

export type SignupRole = Extract<UserRole, "CUSTOMER" | "OWNER" | "RIDER">;

export type UserResponse = {
  id: number;
  email: string;
  nickname: string;
  profileImageUrl: string | null;
  provider: string;
  role: UserRole;
  phoneNumber?: string | null;
  address?: string | null;
};

export type SignupTokenPreview = {
  email: string;
  nickname: string;
  profileImageUrl: string | null;
  provider: string;
};

export type AuthTokenResponse = {
  accessToken: string;
  user: UserResponse;
};

export type SignupRequest = {
  signupToken: string;
  phoneNumber: string;
  address: string;
  role: SignupRole;
};
