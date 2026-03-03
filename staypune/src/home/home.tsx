import { useQuery } from "@tanstack/react-query";
import "../App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import {
  APP_BRAND,
  FEED_SUBTITLE,
  FLATS_SECTION_TITLE,
  LOADING_FLATS_TEXT,
  NO_FLATS_TEXT,
  PUNE_FLATS_QUERY_KEY,
  REDDIT_API_URL,
  RENTAL_EXCLUDE_KEYWORDS,
  RENTAL_INCLUDE_KEYWORDS,
  REDDIT_POST_BASE_URL,
} from "./constants";
import type { RedditListingResponse, RedditPost } from "./types";

async function fetchPuneFlats(): Promise<RedditPost[]> {
  const response = await fetch(REDDIT_API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch flats from Reddit");
  }

  const json: RedditListingResponse = await response.json();
  return json.data.children.map((child) => child.data);
}

function hasKeywordMatch(title: string, keyword: string): boolean {
  if (keyword.includes(" ")) {
    return title.includes(keyword);
  }

  const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const keywordPattern = new RegExp(`\\b${escapedKeyword}\\b`);
  return keywordPattern.test(title);
}

function isRentalPost(post: RedditPost): boolean {
  const title = post.title.toLowerCase();
  const hasRentalKeyword = RENTAL_INCLUDE_KEYWORDS.some((keyword) =>
    hasKeywordMatch(title, keyword),
  );
  const hasExcludedKeyword = RENTAL_EXCLUDE_KEYWORDS.some((keyword) =>
    hasKeywordMatch(title, keyword),
  );

  return hasRentalKeyword && !hasExcludedKeyword;
}

function Home() {
  const {
    data: flats,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: PUNE_FLATS_QUERY_KEY,
    queryFn: fetchPuneFlats,
  });

  const filteredFlats = (flats ?? []).filter(isRentalPost);

  return (
    <div className="home-layout">
      <Header title={APP_BRAND} />

      <div className="home-main">
        <div className="section-header">
          <h2>{FLATS_SECTION_TITLE}</h2>
          <p>{FEED_SUBTITLE}</p>
        </div>

        {!isLoading && !isError && (
          <div className="results-meta">{filteredFlats.length} rental matches</div>
        )}

        {isLoading && <p className="feedback-text">{LOADING_FLATS_TEXT}</p>}

        {isError && <p className="feedback-text error-text">Error: {(error as Error).message}</p>}

        {!isLoading && !isError && filteredFlats.length === 0 && (
          <p className="feedback-text">{NO_FLATS_TEXT}</p>
        )}

        <div className="flat-list">
          {filteredFlats.map((post) => (
            <a
              className="flat-card"
              key={post.id}
              href={`${REDDIT_POST_BASE_URL}${post.permalink}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <h3>{post.title}</h3>
              <p className="meta-row">Posted by u/{post.author}</p>
              <p className="date-row">{new Date(post.created_utc * 1000).toLocaleString()}</p>
            </a>
          ))}
        </div>
      </div>

      <Footer brand={APP_BRAND} />
    </div>
  );
}

export default Home;
