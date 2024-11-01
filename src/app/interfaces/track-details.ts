import { Album } from '@/app/interfaces/album';
import { Artist } from '@/app/interfaces/artist';

export interface TrackDetails {
  album?: Album;
  artists?: Artist[];
  disc_number?: number;
  duration_ms: number;
  explicit?: boolean;
  external_ids?: {
    isrc: string;
  };
  external_urls?: {
    spotify: string;
  };
  href?: string;
  id: string;
  is_playable?: boolean;
  name: string;
  popularity?: number;
  preview_url?: string | null;
  track_number?: number;
  type: string;
  uri?: string;
}