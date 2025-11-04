import { useState, useMemo } from "react";
import "./App.css";
import { FilterOptions, SortType } from "./types";
import { filterItems, sortItems } from "./utils/filterSort";
import { useFavorites } from "./hooks/useFavorites";
import { useTrendData } from "./hooks/useTrendData";
import { TrendCard } from "./components/TrendCard";
import { FilterPanel } from "./components/FilterPanel";
import { SortBar } from "./components/SortBar";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { ErrorMessage } from "./components/ErrorMessage";
import { RefreshCw, TrendingUp, Search } from "lucide-react";
import { Button } from "./components/ui/button";

function App() {
  const [filters, setFilters] = useState<FilterOptions>({
    sources: [],
    categories: [],
    keyword: "",
    dateFrom: undefined,
    dateTo: undefined,
    minScore: undefined,
  });
  const [sortType, setSortType] = useState<SortType>("trend");
  const { favoriteIds, toggleFavorite, isFavorite } = useFavorites();

  // APIからデータを取得
  const { items, isLoading, error, refetch } = useTrendData();

  // 動的にカテゴリを取得
  const availableCategories = useMemo(() => {
    const tags = new Set<string>();
    items.forEach(item => {
      item.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [items]);

  // フィルタリングとソートを適用
  const displayedItems = useMemo(() => {
    console.log('Total items:', items.length);
    console.log('Items by source:', {
      zenn: items.filter(i => i.source === 'zenn').length,
      github: items.filter(i => i.source === 'github').length,
      reddit: items.filter(i => i.source === 'reddit').length,
    });
    console.log('Current filters:', filters);

    const filtered = filterItems(items, filters);
    console.log('Filtered items:', filtered.length);

    return sortItems(filtered, sortType, favoriteIds);
  }, [items, filters, sortType, favoriteIds]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      {/* ヘッダー */}
      <header className="bg-white border-b shadow-sm relative overflow-hidden">
        {/* グラデーション背景 */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-5" />

        <div className="max-w-7xl mx-auto px-4 py-6 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* ロゴアイコン */}
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>

              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  CatchUp
                </h1>
                <p className="text-gray-600 mt-1 text-sm">
                  Zenn、GitHub、Redditから最新のIT系トレンドをキャッチアップ
                </p>
              </div>
            </div>

            <Button
              onClick={refetch}
              disabled={isLoading}
              variant="outline"
              className="flex items-center gap-2 border-2 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white hover:border-transparent transition-all duration-300"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              更新
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 左サイドバー: フィルターパネル */}
          <aside className="lg:col-span-1">
            <FilterPanel
              filters={filters}
              onFiltersChange={setFilters}
              availableCategories={availableCategories}
            />
          </aside>

          {/* メインコンテンツ */}
          <main className="lg:col-span-3 space-y-6">
            {/* ローディング中 */}
            {isLoading && <LoadingSpinner />}

            {/* エラー表示 */}
            {error && !isLoading && (
              <ErrorMessage message={error} onRetry={refetch} />
            )}

            {/* データ表示 */}
            {!isLoading && !error && (
              <>
                {/* ソートバー */}
                <SortBar
                  sortType={sortType}
                  onSortChange={setSortType}
                  resultCount={displayedItems.length}
                />

                {/* トレンドアイテム一覧 */}
                {displayedItems.length === 0 ? (
                  <div className="bg-white border rounded-xl p-12 text-center shadow-sm">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                      <Search className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-lg font-medium">
                      条件に一致するアイテムがありません
                    </p>
                    <p className="text-gray-400 text-sm mt-2">
                      フィルター条件を変更してお試しください
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {displayedItems.map((item, index) => (
                      <TrendCard
                        key={item.id}
                        item={item}
                        index={index}
                        isFavorite={isFavorite(item.id)}
                        onToggleFavorite={toggleFavorite}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
