import { useQuery } from "@tanstack/react-query";
import "../App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

type RedditPost = {
  id: string;
  title: string;
  permalink: string;
  author: string;
  created_utc: number;
  url: string;
};

type RedditListingResponse = {
  data: {
    children: Array<{
      data: RedditPost;
    }>;
  };
};

const REDDIT_URL = "/api/reddit/r/PuneClassifieds/new.json?limit=20";

async function fetchPuneFlats(): Promise<RedditPost[]> {
  const response = await fetch(REDDIT_URL);

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
    queryKey: ["pune-flats"],
    queryFn: fetchPuneFlats,
  });

  return (
    <div className="home-layout">
      <Header title="StayPune" />

      <div className="home-main">
        <h2>Latest Flats from r/PuneClassifieds</h2>

        {isLoading && <p>Loading flats...</p>}

        {isError && <p>Error: {(error as Error).message}</p>}

        {!isLoading && !isError && flats?.length === 0 && (
          <p>No flat posts found right now.</p>
        )}

        <div className="flat-list">
          {flats?.map((post) => (
            <a
              className="flat-card"
              key={post.id}
              href={`https://www.reddit.com${post.permalink}`}
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

      <Footer brand="StayPune" />
    </div>
  );
}

export default Home;
