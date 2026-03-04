import { useQuery } from "@tanstack/react-query";
import "../../App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PostCard from "./components/PostCard";
import {
  appBrand,
  feedSubtitle,
  flatsSectionTitle,
  loadingFlatsText,
  noFlatsText,
  puneFlatsQueryKey,
} from "../../lib/constants/app";
import { fetchRentalPosts } from "../../lib/api/flats";

function Home() {
  const {
    data: flats,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: puneFlatsQueryKey,
    queryFn: fetchRentalPosts,
  });

  const rentalFlats = flats ?? [];

  return (
    <div className="home-layout">
      <Header title={appBrand} />

      <div className="home-main">
        <div className="section-header">
          <h2>{flatsSectionTitle}</h2>
          <p>{feedSubtitle}</p>
        </div>

        {!isLoading && !isError && (
          <div className="results-meta">{rentalFlats.length} rental matches</div>
        )}

        {isLoading && <p className="feedback-text">{loadingFlatsText}</p>}

        {isError && <p className="feedback-text error-text">Error: {(error as Error).message}</p>}

        {!isLoading && !isError && rentalFlats.length === 0 && (
          <p className="feedback-text">{noFlatsText}</p>
        )}

        <div className="flat-list">
          {rentalFlats.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>

      <Footer brand={appBrand} />
    </div>
  );
}

export default Home;
