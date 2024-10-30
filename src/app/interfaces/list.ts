import { Track } from "@/app/interfaces/track";

enum MediaType {
  Artiste = "Artiste",
  Album = "Album",
  Playlist = "Liste de lecture",
}

enum Visibility {
  Public = "Publique",
  Private = "Privée",
}

export interface list {
  id?: number;
  title: string;
  subtitle?: string;
  imageUrl?: string;
  description?: string;
  type: MediaType;
  verified?: boolean;
  publicationDate: Date;
  visibility: Visibility;
  nbreSaves: number;
  tracks: Track[];
}