export const APP_BRAND = "StayPune";
export const FLATS_SECTION_TITLE = "Latest Flats from r/PuneClassifieds";
export const LOADING_FLATS_TEXT = "Loading flats...";
export const NO_FLATS_TEXT = "No rental-related posts found right now.";
export const FEED_SUBTITLE = "Rental-focused posts from r/PuneClassifieds";

export const REDDIT_API_URL = "/api/reddit/r/PuneClassifieds/new.json?limit=20";
export const REDDIT_POST_BASE_URL = "https://www.reddit.com";

export const PUNE_FLATS_QUERY_KEY = ["pune-flats"] as const;

export const RENTAL_INCLUDE_KEYWORDS = [
  "rent",
  "rental",
  "flat",
  "apartment",
  "bhk",
  "room",
  "roommate",
  "occupancy",
  "pg",
  "lease",
  "place to stay",
  "no broker",
] as const;

export const RENTAL_EXCLUDE_KEYWORDS = [
  "selling",
  "for sale",
  "sale",
  "macbook",
  "notes",
  "shop",
  "godown",
  "job",
] as const;
