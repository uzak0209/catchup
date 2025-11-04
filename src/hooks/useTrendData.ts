import { useState, useEffect } from 'react';
import { TrendItem } from '../types';
import { fetchAllTrends } from '../api/fetchData';

interface UseTrendDataReturn {
  items: TrendItem[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * トレンドデータを取得するカスタムフック
 */
export function useTrendData(): UseTrendDataReturn {
  const [items, setItems] = useState<TrendItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchAllTrends();

      if (data.length === 0) {
        setError('データの取得に失敗しました。後でもう一度お試しください。');
      } else {
        setItems(data);

        // 取得したタグを抽出してローカルストレージに保存
        const allTags = new Set<string>();
        data.forEach(item => {
          item.tags.forEach(tag => allTags.add(tag));
        });
        localStorage.setItem('available-tags', JSON.stringify(Array.from(allTags)));
      }
    } catch (err) {
      console.error('Error fetching trend data:', err);
      setError('データの取得中にエラーが発生しました。');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // 5分ごとに自動更新
    const interval = setInterval(fetchData, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return {
    items,
    isLoading,
    error,
    refetch: fetchData,
  };
}
