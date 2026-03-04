import { useState } from "react";
import { Skeleton } from "../../components/ui/skeleton";
import { redditPostBaseUrl } from "../../lib/utils/constants";
import type { PostCardProps } from "../../lib/utils/types";

function PostCard({ post }: PostCardProps) {
  const [hasImageError, setHasImageError] = useState(false);
  const shouldShowSkeleton = !post.previewImage || hasImageError;

  return (
    <a
      className="flat-card"
      href={`${redditPostBaseUrl}${post.permalink}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      {shouldShowSkeleton ? (
        <Skeleton className="flat-card-image flat-card-image-skeleton" />
      ) : (
        <img
          className="flat-card-image"
          src={post.previewImage ?? undefined}
          alt={post.title}
          onError={() => setHasImageError(true)}
        />
      )}
      <div className="flat-card-content">
        <h3>{post.title}</h3>
        <p className="date-row">{new Date(post.createdUtc * 1000).toLocaleDateString()}</p>
      </div>
    </a>
  );
}

export default PostCard;
