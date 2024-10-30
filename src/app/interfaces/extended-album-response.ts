import { AlbumResponse } from "./album-response";

export interface ExtendedAlbumResponse extends AlbumResponse {
  otherAlbums: AlbumResponse[] | null;
}