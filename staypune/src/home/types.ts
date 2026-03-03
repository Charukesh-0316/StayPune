export type RedditPost = {
  id: string;
  title: string;
  permalink: string;
  author: string;
  created_utc: number;
  url: string;
};

export type RedditListingResponse = {
  data: {
    children: Array<{
      data: RedditPost;
    }>;
  };
};

export type HeaderProps = {
  title: string;
};

export type FooterProps = {
  brand: string;
};
