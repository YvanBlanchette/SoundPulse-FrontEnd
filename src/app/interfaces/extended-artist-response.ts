import { AlbumResponse } from "./album-response";
import { ArtistResponse } from "./artist-response";
import { TrackResponse } from "./track-response";

export interface ExtendedArtistResponse extends ArtistResponse {
  created_at: string;
  updated_at: string;
  albums: AlbumResponse[] | null;
  topTracks: TrackResponse[] | null;
}