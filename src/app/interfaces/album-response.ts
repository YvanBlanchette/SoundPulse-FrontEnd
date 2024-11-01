export interface AlbumResponse {
  album_type: string;
  total_tracks: number;
  available_markets: string[];
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  images: {
    url: string;
    height: number;
    width: number;
  }[];
  name: string;
  release_date: string;
  release_date_precision: string;
  restrictions?: {
    reason: string;
  };
  type: string;
  uri: string;
  artists: AlbumArtist[];
  tracks: AlbumTracks;
  copyrights: AlbumCopyright[];
  external_ids: {
    isrc: string;
    ean?: string;
    upc?: string;
  };
  genres?: string[];
  label: string;
  popularity: number;
}

interface AlbumArtist {
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
}

interface AlbumTracks {
  href: string;
  items: AlbumTrack[];
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
}

interface AlbumTrack {
  artists: AlbumArtist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  is_playable: boolean;
  linked_from?: {
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    type: string;
    uri: string;
  };
  restrictions?: {
    reason: string;
  };
  name: string;
  preview_url: string | null;
  track_number: number;
  type: string;
  uri: string;
  is_local: boolean;
}

interface AlbumCopyright {
  text: string;
  type: string;
}