import { BaseResponse } from '@/app/interfaces/base-response';
import { Owner } from '@/app/interfaces/owner';
import { Tracks } from '@/app/interfaces/tracks';

export interface PlaylistResponse extends BaseResponse {
  collaborative?: boolean;
  description?: string;
  followers?: {
    href?: string | null;
    total?: number;
  };
  owner?: Owner;
  public?: boolean;
  snapshot_id?: string;
  tracks?: Tracks;
}