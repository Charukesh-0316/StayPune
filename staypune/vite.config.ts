import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { redditSourceUrl } from "./src/lib/constants/app";
import { mapRentalPostPreviews } from "./src/lib/parsers/reddit";
import type { RedditListingResponse } from "./src/lib/types/reddit";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: "flats-api-middleware",
      configureServer(server) {
        server.middlewares.use("/api/flats", async (_req, res) => {
          try {
            const response = await fetch(redditSourceUrl, {
              headers: {
                "user-agent": "StayPuneFeed/1.0",
              },
            });

            if (!response.ok) {
              res.statusCode = response.status;
              res.setHeader("Content-Type", "application/json");
              res.end(
                JSON.stringify({ error: "Failed to fetch flats from Reddit" }),
              );
              return;
            }

            const listing =
              (await response.json()) as RedditListingResponse;
            const rentalPosts = mapRentalPostPreviews(listing);

            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(rentalPosts));
          } catch {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "Unexpected server error" }));
          }
        });
      },
    },
  ],
});
