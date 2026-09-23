export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash?: string; // omitted in most responses
  createdAt?: string;
  updatedAt?: string;
}

export interface RegisterInput {
  name: string;
  email: string;       // must be @company.com
  password: string;
  confirmPassword: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

/** Shape returned by POST /api/auth/login */
export interface AuthResponse {
  data: User;
  accessToken: string;
  // refreshToken arrives as httpOnly cookie — not in body
}

/** Shape returned by POST /api/auth/refresh */
export interface RefreshResponse {
  accessToken: string;
}
