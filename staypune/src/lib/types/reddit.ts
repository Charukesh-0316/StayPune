export type RedditListingChild = {
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
};

export type RedditListingResponse = {
  data: {
    children: RedditListingChild[];
  };
};

export type RentalPostPreview = {
  id: string;
  title: string;
  permalink: string;
  createdUtc: number;
  previewImage: string | null;
};

export type HeaderProps = {
  title: string;
};

export type FooterProps = {
  brand: string;
};

export type PostCardProps = {
  post: RentalPostPreview;
};

export type RedditResponse = {
  status: (code: number) => RedditResponse;
  json: (body: unknown) => void;
};
