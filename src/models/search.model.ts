export interface Search {
  query: string;
  radius: number;
}

export interface SearchResponse {
  businesses: Business[];
  total: number;
  offset: number;
  region: Region;
}

export interface Business {
  id: string;
  name: string;
  image_url: string;
  is_closed: boolean;
  distance: number;
  rating: number;
}

export interface Region {
  center: Coordinates;
}

export interface Coordinates {
  longitude: string;
  latitude: string;
}


