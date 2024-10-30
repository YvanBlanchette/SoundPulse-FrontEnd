import { BaseResponse } from '@/app/interfaces/base-response';

export interface ArtistResponse extends BaseResponse {
  followers?: {
    href?: string | null;
    total?: number;
  };
  genres?: string[];
}