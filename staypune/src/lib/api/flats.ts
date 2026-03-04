import { redditPostsApiUrl } from "../constants/app";
import type { RentalPostPreview } from "../types/reddit";

export async function fetchRentalPosts(): Promise<RentalPostPreview[]> {
  const response = await fetch(redditPostsApiUrl);

  if (!response.ok) {
    throw new Error("Failed to fetch flats from server");
  }
   const posts = await response.json() as RentalPostPreview[];

  return posts;
}
