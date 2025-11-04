import { TrendItem, FilterOptions, SortType } from '../types';

/**
 * アイテムをフィルタリングする
 */
export function filterItems(items: TrendItem[], filters: FilterOptions): TrendItem[] {
  return items.filter(item => {
    // ソースフィルター
    if (filters.sources.length > 0 && !filters.sources.includes(item.source)) {
      return false;
    }

    // カテゴリ/タグフィルター
    if (filters.categories.length > 0) {
      const hasMatchingTag = filters.categories.some(category =>
        item.tags.includes(category)
      );
      if (!hasMatchingTag) return false;
    }

    // キーワード検索
    if (filters.keyword.trim()) {
      const keyword = filters.keyword.toLowerCase();
      const matchesTitle = item.title.toLowerCase().includes(keyword);
      const matchesDescription = item.description?.toLowerCase().includes(keyword);
      const matchesTags = item.tags.some(tag => tag.toLowerCase().includes(keyword));

      if (!matchesTitle && !matchesDescription && !matchesTags) {
        return false;
      }
    }

    // 日付範囲フィルター
    if (filters.dateFrom && item.publishedAt < filters.dateFrom) {
      return false;
    }
    if (filters.dateTo && item.publishedAt > filters.dateTo) {
      return false;
    }

    // 人気度フィルター（最小スコア）
    if (filters.minScore !== undefined && item.score < filters.minScore) {
      return false;
    }

    return true;
  });
}

/**
 * アイテムをソートする
 */
export function sortItems(
  items: TrendItem[],
  sortType: SortType,
  favoriteIds: string[]
): TrendItem[] {
  const itemsCopy = [...items];

  switch (sortType) {
    case 'trend':
      // スコア（人気度）の高い順
      return itemsCopy.sort((a, b) => b.score - a.score);

    case 'recent':
      // 新しい順
      return itemsCopy.sort((a, b) =>
        b.publishedAt.getTime() - a.publishedAt.getTime()
      );

    case 'favorite':
      // お気に入りを先頭に、それ以外はスコア順
      return itemsCopy.sort((a, b) => {
        const aIsFavorite = favoriteIds.includes(a.id);
        const bIsFavorite = favoriteIds.includes(b.id);

        if (aIsFavorite && !bIsFavorite) return -1;
        if (!aIsFavorite && bIsFavorite) return 1;

        // 両方お気に入りか両方お気に入りでない場合はスコア順
        return b.score - a.score;
      });

    default:
      return itemsCopy;
  }
}
