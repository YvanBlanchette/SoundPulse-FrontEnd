export interface FavouriteTrackRequest {
  trackId: string;
  song_id: string;
  name: string;
  duration_ms: number;
  artists: any[];
  preview_url: string;
}