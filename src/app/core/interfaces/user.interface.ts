/** User model with authentication and profile data */
export interface User {
  id: string;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar?: string;
  roles: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/** User profile (excludes sensitive fields) */
export interface UserProfile extends Omit<User, 'password'> {}

/** Update user request (all fields optional) */
export interface UpdateUserRequest {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
}
