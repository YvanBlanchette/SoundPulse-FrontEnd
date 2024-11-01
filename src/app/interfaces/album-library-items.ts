import { AlbumResponse } from "./album-response"
import { LibraryItem } from "./library-item"
import { Track } from "./track"

interface ExtendedTrack extends Track {
  available_markets: string[];
  is_local: boolean;
}

export interface AlbumLibraryItem extends AlbumResponse, LibraryItem {
  tracks: {
    href: string;
    items: ExtendedTrack[];
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total: number;
  }
  user_id: string
  owner: string
  created_at: string
  updated_at: string
}