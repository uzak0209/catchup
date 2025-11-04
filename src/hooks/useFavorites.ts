import { useState, useEffect } from 'react';

const FAVORITES_STORAGE_KEY = 'catchup-favorites';

/**
 * お気に入り機能のカスタムフック
 */
export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  // LocalStorageから読み込み
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) {
        setFavoriteIds(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load favorites from localStorage:', error);
    }
  }, []);

  // LocalStorageに保存
  const saveFavorites = (ids: string[]) => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(ids));
      setFavoriteIds(ids);
    } catch (error) {
      console.error('Failed to save favorites to localStorage:', error);
    }
  };

  // お気に入りに追加
  const addFavorite = (id: string) => {
    if (!favoriteIds.includes(id)) {
      const newFavorites = [...favoriteIds, id];
      saveFavorites(newFavorites);
    }
  };

  // お気に入りから削除
  const removeFavorite = (id: string) => {
    const newFavorites = favoriteIds.filter(fid => fid !== id);
    saveFavorites(newFavorites);
  };

  // お気に入りのトグル
  const toggleFavorite = (id: string) => {
    if (favoriteIds.includes(id)) {
      removeFavorite(id);
    } else {
      addFavorite(id);
    }
  };

  // 指定したIDがお気に入りかチェック
  const isFavorite = (id: string) => favoriteIds.includes(id);

  return {
    favoriteIds,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
  };
}
