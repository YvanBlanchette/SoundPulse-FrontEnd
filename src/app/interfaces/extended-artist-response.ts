import { AlbumResponse } from "./album-response";
import { ArtistResponse } from "./artist-response";
import { TrackResponse } from "./track-response";

export interface ExtendedArtistResponse extends ArtistResponse {
  albums: AlbumResponse[] | null;
  topTracks: TrackResponse | null;
}