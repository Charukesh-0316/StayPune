import { redditPostsApiUrl } from "./constants";
import type { RentalPostPreview } from "./types";

export async function fetchRentalPosts(): Promise<RentalPostPreview[]> {
  const response = await fetch(redditPostsApiUrl);

  if (!response.ok) {
    throw new Error("Failed to fetch flats from server");
  }

  return response.json() as Promise<RentalPostPreview[]>;
}
