export interface MediaItem {
  id: string;
  title: string;
  description?: string;
  release_date?: string;
  rating: Record<string, number>;
  image_url?: string;
  source: string;
  media_type: string;
}
