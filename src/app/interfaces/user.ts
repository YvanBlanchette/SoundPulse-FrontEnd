export interface UserResponse {
  message: string;
  data: User;
}

export interface User {
  id?: number;
  name: string;
  email: string;
  avatar: string;
  password?: string;
  email_verified_at?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: any;
}