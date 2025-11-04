export type SourceType = 'zenn' | 'github' | 'reddit';

export type SortType = 'trend' | 'recent' | 'favorite';

export interface TrendItem {
  id: string;
  source: SourceType;
  title: string;
  description?: string;
  url: string;
  author: string;
  authorUrl?: string;
  score: number; // いいね数、スター数など
  commentsCount: number;
  tags: string[];
  publishedAt: Date;
  thumbnailUrl?: string;
}

export interface FilterOptions {
  sources: SourceType[];
  categories: string[];
  keyword: string;
  dateFrom?: Date;
  dateTo?: Date;
  minScore?: number;
}

// API Response Types
export interface ZennArticle {
  id: number;
  title: string;
  slug: string;
  comments_count: number;
  liked_count: number;
  body_letters_count: number;
  article_type: string;
  emoji: string;
  published_at: string;
  user: {
    username: string;
    name: string;
  };
}

export interface GitHubSearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubRepo[];
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
  };
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  created_at: string;
}

export interface RedditPost {
  data: {
    id: string;
    title: string;
    author: string;
    subreddit: string;
    score: number;
    num_comments: number;
    created_utc: number;
    url: string;
    selftext: string;
    permalink: string;
    thumbnail?: string;
    link_flair_text?: string;
  };
}
