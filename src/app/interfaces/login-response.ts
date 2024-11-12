import { User } from "./user";

export interface LoginResponse {
  token: string;
  data: User;
}