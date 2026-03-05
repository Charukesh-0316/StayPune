import { redditSourceUrl } from "../src/lib/constants/app";
import { mapRentalPostPreviews } from "../src/lib/parsers/reddit";
import type {  RedditResponse, RedditListingResponse } from "../src/lib/types/reddit";


export default async function handler(_req: unknown, res: RedditResponse) {
  try {
    const response = await fetch(redditSourceUrl, {
      headers: {
        "user-agent": "StayPuneFeed/1.0",
      },
    });

    if (!response.ok) {
      res.status(response.status).json({
        error: "Failed to fetch flats from Reddit",
      });
      return;
    }

    const listing = (await response.json()) as RedditListingResponse;
    const rentalPosts = mapRentalPostPreviews(listing);
    res.status(200).json(rentalPosts);
  } catch {
    res.status(500).json({ error: "Unexpected server error" });
  }
}
