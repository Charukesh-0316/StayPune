export const appBrand = "StayPune";
export const flatsSectionTitle = "Latest Flats from StayPune";
export const loadingFlatsText = "Loading flats...";
export const noFlatsText = "No rental-related posts found right now.";
export const feedSubtitle = "Hope you will find your next stay in Pune here!";

export const redditPostsApiUrl = "/api/flats";
export const redditSourceUrl =
  "https://www.reddit.com/r/PuneClassifieds/new.json?limit=20";
export const redditPostBaseUrl = "https://www.reddit.com";

export const puneFlatsQueryKey = ["pune-flats"] as const;

export const rentalIncludeKeywords = [
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

export const rentalExcludeKeywords = [
  "selling",
  "for sale",
  "sale",
  "macbook",
  "notes",
  "shop",
  "godown",
  "job",
] as const;
