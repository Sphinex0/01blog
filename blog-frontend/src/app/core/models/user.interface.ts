export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  avatar?: string;
  bio?: string;
  role: 'USER' | 'ADMIN';
  isActive: boolean;
  isBanned?: boolean; 
  bannedUntil?: Date | string | null; 
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date; 
}

export interface UserProfile extends User {
  postsCount: number;
  followersCount: number;
  followingCount: number;
  isFollowed?: boolean;
}

export interface AdminUserDetails extends UserProfile {
  reportCount?: number;
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
  user: User;
  expiresIn: number;
}

export interface UpdateUserRequest {
  fullName?: string;
  bio?: string;
  avatar?: string;
}