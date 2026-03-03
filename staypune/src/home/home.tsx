import { useQuery } from "@tanstack/react-query";
import "../App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import {
  APP_BRAND,
  FLATS_SECTION_TITLE,
  LOADING_FLATS_TEXT,
  NO_FLATS_TEXT,
  PUNE_FLATS_QUERY_KEY,
  REDDIT_API_URL,
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

  return (
    <div className="home-layout">
      <Header title={APP_BRAND} />

      <div className="home-main">
        <h2>{FLATS_SECTION_TITLE}</h2>

        {isLoading && <p>{LOADING_FLATS_TEXT}</p>}

        {isError && <p>Error: {(error as Error).message}</p>}

        {!isLoading && !isError && flats?.length === 0 && <p>{NO_FLATS_TEXT}</p>}

        <div className="flat-list">
          {flats?.map((post) => (
            <a
              className="flat-card"
              key={post.id}
              href={`${REDDIT_POST_BASE_URL}${post.permalink}`}
              target="_blank"
              rel="noreferrer"
            >
              <h3>{post.title}</h3>
              <p>Posted by u/{post.author}</p>
              <p>{new Date(post.created_utc * 1000).toLocaleString()}</p>
            </a>
          ))}
        </div>
      </div>

      <Footer brand={APP_BRAND} />
    </div>
  );
}

export default Home;
