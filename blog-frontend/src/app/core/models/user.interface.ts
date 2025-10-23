export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  avatar?: string;
  bio?: string;
  role: 'USER' | 'ADMIN';
  isActive: boolean;
  isBanned?: boolean; // ADD THIS
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date; // ADD THIS
}

export interface UserProfile extends User {
  postsCount: number;
  followersCount: number;
  followingCount: number;
  isFollowed?: boolean;
}

// ADD THIS: For admin user management
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
  refreshToken: string;
  user: User;
  expiresIn: number;
}

export interface UpdateUserRequest {
  fullName?: string;
  bio?: string;
  avatar?: string;
}