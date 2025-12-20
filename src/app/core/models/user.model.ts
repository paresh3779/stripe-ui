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

export interface UserProfile extends Omit<User, 'password'> {
  // Additional profile fields can be added here
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
}
