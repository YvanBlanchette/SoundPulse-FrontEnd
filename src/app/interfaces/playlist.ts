export interface Playlist {
  id: number;
  name: string;
  imageUrl: string;
  description?: string;
  publicationDate: Date;
  trackIds: number[];
  length: number;
}