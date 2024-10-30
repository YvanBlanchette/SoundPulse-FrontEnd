import { BaseResponse } from '@/app/interfaces/base-response';
import { Image } from '@/app/interfaces/image';
import { Artist } from '@/app/interfaces/artist';
import { Tracks } from '@/app/interfaces/tracks';

export interface AlbumResponse extends BaseResponse {
  album_type?: string;
  total_tracks?: number;
  release_date?: string;
  release_date_precision?: string;
  artists?: Artist[];
  tracks?: Tracks;
}