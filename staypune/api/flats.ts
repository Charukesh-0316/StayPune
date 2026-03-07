type ApiResponse = {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
};

type RedditListingResponse = {
  data: {
    children: Array<{
      data: {
        id: string;
        title: string;
        permalink: string;
        created_utc: number;
        thumbnail?: string;
        preview?: {
          images?: Array<{
            source?: {
              url?: string;
            };
          }>;
        };
      };
    }>;
  };
};

const redditSourceUrls = [
  "https://www.reddit.com/r/PuneClassifieds/new.json?limit=20",
];

const rentalIncludeKeywords = [
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

const rentalExcludeKeywords = [
  "selling",
  "for sale",
  "sale",
  "macbook",
  "notes",
  "shop",
  "godown",
  "job",
] as const;

function hasKeywordMatch(title: string, keyword: string): boolean {
  if (keyword.includes(" ")) {
    return title.includes(keyword);
  }

  const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const keywordPattern = new RegExp(`(?<![a-z])${escapedKeyword}(?![a-z])`);
  return keywordPattern.test(title);
}

function isRentalTitle(title: string): boolean {
  const normalizedTitle = title.toLowerCase();
  const hasRentalKeyword = rentalIncludeKeywords.some((keyword) =>
    hasKeywordMatch(normalizedTitle, keyword),
  );
  const hasExcludedKeyword = rentalExcludeKeywords.some((keyword) =>
    hasKeywordMatch(normalizedTitle, keyword),
  );

  return hasRentalKeyword && !hasExcludedKeyword;
}

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function extractPreviewImage(post: {
  thumbnail?: string;
  preview?: {
    images?: Array<{
      source?: {
        url?: string;
      };
    }>;
  };
}): string | null {
  const previewUrl = post.preview?.images?.[0]?.source?.url;
  if (previewUrl) {
    return decodeHtmlEntities(previewUrl);
  }

  const thumbnail = post.thumbnail?.trim();
  if (thumbnail && /^https?:\/\//i.test(thumbnail)) {
    return thumbnail;
  }

  return null;
}

function mapRentalPostPreviews(listing: RedditListingResponse) {
  return listing.data.children
    .map((child) => child.data)
    .filter((post) => isRentalTitle(post.title))
    .map((post) => ({
      id: post.id,
      title: post.title,
      permalink: post.permalink,
      createdUtc: post.created_utc,
      previewImage: extractPreviewImage(post),
    }));
}

async function fetchListingWithFallback() {
  const upstreamStatuses: number[] = [];

  for (const url of redditSourceUrls) {
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
          Accept: "application/json",
          "Accept-Language": "en-US,en;q=0.9",
          Referer: "https://www.reddit.com/",
        },
      });

      if (response.ok) {
        const listing = (await response.json()) as RedditListingResponse;
        return {
          listing,
          upstreamStatuses,
        };
      }

      upstreamStatuses.push(response.status);
    } catch {
      // Keep trying the next source URL.
      upstreamStatuses.push(0);
    }
  }

  return {
    listing: null,
    upstreamStatuses,
  };
}

export default async function handler(_req: unknown, res: ApiResponse) {
  try {
    const { listing, upstreamStatuses } = await fetchListingWithFallback();
    if (!listing) {
      res.status(502).json({
        error: "Failed to fetch flats from Reddit",
        upstreamStatuses,
      });
      return;
    }

    const rentalPosts = mapRentalPostPreviews(listing);
    res.status(200).json(rentalPosts);
  } catch {
    res.status(500).json({ error: "Unexpected server error" });
  }
}
