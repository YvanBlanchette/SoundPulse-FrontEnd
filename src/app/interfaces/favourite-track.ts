export interface FavouriteTrack {
  id: string;
  track: Track;
  isFavourite: boolean;
}

interface Track {
  id: string;
  name: string;
  duration_ms: number;
  preview_url: string | null;
  artists: TrackArtist[];
  album: TrackAlbum;
}

interface TrackArtist {
  id: string;
  name: string;
  type: string;
  external_urls: {
    spotify: string;
  };
  href: string;
  uri: string;
  images: {
    url: string;
    width: number;
    height: number;
  }[];
}

interface TrackAlbum {
  id: string;
  name: string;
  type: string;
  external_urls: {
    spotify: string;
  };
  href: string;
  uri: string;
  images: {
    url: string;
    width: number;
    height: number;
  }[];
  release_date: string;
  total_tracks: number;
}