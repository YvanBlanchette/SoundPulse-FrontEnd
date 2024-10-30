import { Artist } from '@/app/interfaces/artist';
import { Image } from '@/app/interfaces/base-response';

export interface Album {
  album_type: string;
  total_tracks: number;
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  images: Image[];
  name: string;
  release_date: string;
  release_date_precision: string;
  type: string;
  uri: string;
  artists: Artist[];
  is_playable?: boolean;
}