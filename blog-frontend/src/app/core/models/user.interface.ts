export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  avatar?: string;
  bio?: string;
  // isAdmin: boolean;
  role: 'USER' | 'ADMIN';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile extends User {
  postsCount: number;
  followersCount: number;
  followingCount: number;
  isFollowed?: boolean;
}

export interface RegisterRequest {
  fullName: string;
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
  expiresIn: number;
}

export interface UpdateUserRequest {
  fullName?: string;
  bio?: string;
  avatar?: string;
}
