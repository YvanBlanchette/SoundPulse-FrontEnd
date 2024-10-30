export interface BaseResponse {
  external_urls?: {
    spotify?: string;
  };
  href?: string;
  id?: string;
  images?: Image[];
  name?: string;
  type?: string;
  uri?: string;
  popularity?: number;
}

export interface Image {
  url?: string;
  height?: number | null;
  width?: number | null;
}