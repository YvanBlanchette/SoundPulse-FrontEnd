export enum MediaType { "Artiste", "Album", "Liste de lecture" }

export interface ListItem {
  id: number;
  title: string;
  subtitle?: string;
  imageUrl?: string;
  mediaType: string;
}