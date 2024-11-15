import { SafeUrl } from "@angular/platform-browser";

export interface LibraryItem {
  id: string;
  user_id?: string;
  name: string;
  owner: string;
  owner_id?: string;
  created_at: string;
  updated_at: string;
  images: { url: string; width: number; height: number; }[];
  type: string;
  image_url?: SafeUrl | null;
}