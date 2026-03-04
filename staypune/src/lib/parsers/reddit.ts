import { rentalExcludeKeywords, rentalIncludeKeywords } from "../constants/app";
import type { RedditListingResponse, RentalPostPreview } from "../types/reddit";

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

export function mapRentalPostPreviews(
  listing: RedditListingResponse,
): RentalPostPreview[] {
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
