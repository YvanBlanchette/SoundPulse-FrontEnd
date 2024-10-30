import { Artist } from '@/app/interfaces/artist';
import { Track } from '@/app/interfaces/track';

export interface Tracks {
  href: string;
  items: Track[];
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
}