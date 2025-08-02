/**
 * Represents a single media result retrieved from an external provider.
 */
export interface MediaItem {
  /** The provider-specific ID for the media (e.g. TMDb ID, AniList ID, etc.) */
  id: string;

  /** The title of the media (e.g. movie name, book title) */
  title: string;

  /** A short description or synopsis of the media (optional) */
  description?: string;

  /** The release date of the media, if available (optional) */
  release_date?: string;

  /** Ratings from various providers (e.g. {"TMDb": 8.1, "AniList": 78}) */
  rating: Record<string, number>;

  /** URL to the media's cover image or poster (optional) */
  image_url?: string;

  /** The name of the source provider (e.g. "TMDb", "AniList", "VNDB", "GoogleBooks") */
  source: string;

  /** The type/category of media (e.g. "movie", "anime", "book", "game") */
  media_type: string;
}


/**
 * Represents a media entry saved by the user in ZeHubbo.
 * Extends MediaItem with additional user-specific metadata.
 */
export type SavedEntry = MediaItem & {
  /** The user's current status with this media (e.g. watching, dropped) */
  userStatus: string;

  /** User's personal rating of the media, from 0 to 10 */
  userRating: number;

  /** User's written review about the media */
  userReview: string;

  /** User's written notes about the media */
  userNotes: string;

  /** Whether the media is marked as a favorite by the user */
  favorite: boolean;

  /** ISO timestamp of when the entry was saved */
  savedAt: string;
};
