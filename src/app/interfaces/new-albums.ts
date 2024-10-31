import { AlbumResponse } from "./album-response";

export interface NewAlbums {
  albums: {
    href: string;
    items: AlbumResponse[];
  };
}