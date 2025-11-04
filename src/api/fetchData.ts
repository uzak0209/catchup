import { invoke } from '@tauri-apps/api/core';
import { TrendItem, ZennArticle, GitHubSearchResponse, RedditPost } from '../types';

/**
 * Zenn APIから記事を取得（Tauriコマンド経由）
 */
export async function fetchZennArticles(): Promise<TrendItem[]> {
  try {
    const responseText = await invoke<string>('fetch_zenn_articles');
    const data = JSON.parse(responseText);
    const articles: ZennArticle[] = data.articles || [];

    return articles.slice(0, 20).map((article) => ({
      id: `zenn-${article.id}`,
      source: 'zenn' as const,
      title: article.title,
      description: `${article.emoji} ${article.article_type === 'tech' ? '技術記事' : '記事'} - ${article.body_letters_count}文字`,
      url: `https://zenn.dev/${article.user.username}/articles/${article.slug}`,
      author: article.user.name || article.user.username,
      authorUrl: `https://zenn.dev/${article.user.username}`,
      score: article.liked_count,
      commentsCount: article.comments_count,
      tags: ['Zenn', article.article_type === 'tech' ? 'Tech' : 'Idea'],
      publishedAt: new Date(article.published_at),
      thumbnailUrl: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200"><rect width="400" height="200" fill="#00B8D4"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white" font-size="48">${article.emoji}</text></svg>`)}`,
    }));
  } catch (error) {
    console.error('Failed to fetch Zenn articles:', error);
    return [];
  }
}

/**
 * GitHub Trending APIから人気リポジトリを取得（Tauriコマンド経由）
 */
export async function fetchGitHubTrending(): Promise<TrendItem[]> {
  try {
    const responseText = await invoke<string>('fetch_github_trending');
    const searchResponse: GitHubSearchResponse = JSON.parse(responseText);

    console.log('GitHub repos fetched:', searchResponse.items.length);
    console.log('First GitHub repo:', searchResponse.items[0]);

    const trendItems = searchResponse.items.slice(0, 20).map((repo) => ({
      id: `github-${repo.id}`,
      source: 'github' as const,
      title: repo.full_name,
      description: repo.description || 'No description provided',
      url: repo.html_url,
      author: repo.owner.login,
      authorUrl: `https://github.com/${repo.owner.login}`,
      score: repo.stargazers_count,
      commentsCount: repo.forks_count,
      tags: ['GitHub', repo.language || 'Unknown'].filter(Boolean),
      publishedAt: new Date(repo.created_at),
      thumbnailUrl: repo.language
        ? `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200"><rect width="400" height="200" fill="#24292e"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white" font-size="24" font-family="sans-serif">${repo.language}</text></svg>`)}`
        : `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200"><rect width="400" height="200" fill="#24292e"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white" font-size="24" font-family="sans-serif">Code</text></svg>')}`,
    }));

    console.log('GitHub trend items created:', trendItems.length);
    console.log('First GitHub trend item:', trendItems[0]);

    return trendItems;
  } catch (error) {
    console.error('Failed to fetch GitHub trending:', error);
    return [];
  }
}

/**
 * Reddit APIからプログラミング関連の投稿を取得（Tauriコマンド経由）
 */
export async function fetchRedditPosts(): Promise<TrendItem[]> {
  try {
    const subreddits = ['programming', 'webdev', 'javascript'];
    const allPosts: TrendItem[] = [];

    for (const subreddit of subreddits) {
      try {
        const responseText = await invoke<string>('fetch_reddit_posts', { subreddit });
        const data = JSON.parse(responseText);
        const posts: RedditPost[] = data.data.children || [];

        const items = posts.map((post) => ({
          id: `reddit-${post.data.id}`,
          source: 'reddit' as const,
          title: post.data.title,
          description: post.data.selftext ? post.data.selftext.slice(0, 150) + '...' : `r/${post.data.subreddit}への投稿`,
          url: `https://www.reddit.com${post.data.permalink}`,
          author: post.data.author,
          authorUrl: `https://www.reddit.com/u/${post.data.author}`,
          score: post.data.score,
          commentsCount: post.data.num_comments,
          tags: ['Reddit', post.data.subreddit, post.data.link_flair_text].filter(Boolean) as string[],
          publishedAt: new Date(post.data.created_utc * 1000),
          thumbnailUrl: post.data.thumbnail && post.data.thumbnail.startsWith('http')
            ? post.data.thumbnail
            : `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200"><rect width="400" height="200" fill="#FF4500"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white" font-size="32" font-family="sans-serif">Reddit</text></svg>')}`,
        }));

        allPosts.push(...items);
      } catch (error) {
        console.warn(`Failed to fetch Reddit posts from r/${subreddit}:`, error);
      }
    }

    return allPosts;
  } catch (error) {
    console.error('Failed to fetch Reddit posts:', error);
    return [];
  }
}

/**
 * 全てのソースからデータを取得
 */
export async function fetchAllTrends(): Promise<TrendItem[]> {
  const [zennArticles, githubRepos, redditPosts] = await Promise.all([
    fetchZennArticles(),
    fetchGitHubTrending(),
    fetchRedditPosts(),
  ]);

  return [...zennArticles, ...githubRepos, ...redditPosts];
}
