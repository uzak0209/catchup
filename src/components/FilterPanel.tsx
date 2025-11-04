import { FilterOptions, SourceType } from '../types';
import { X, Search, Calendar, TrendingUp, Filter } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

interface FilterPanelProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  availableCategories: string[];
}

export function FilterPanel({
  filters,
  onFiltersChange,
  availableCategories,
}: FilterPanelProps) {
  const sources: SourceType[] = ['zenn', 'github', 'reddit'];

  const sourceGradients = {
    zenn: 'from-blue-500 to-cyan-500',
    github: 'from-gray-800 to-gray-600',
    reddit: 'from-orange-500 to-red-500',
  };

  const toggleSource = (source: SourceType) => {
    const newSources = filters.sources.includes(source)
      ? filters.sources.filter((s) => s !== source)
      : [...filters.sources, source];
    onFiltersChange({ ...filters, sources: newSources });
  };

  const toggleCategory = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];
    onFiltersChange({ ...filters, categories: newCategories });
  };

  const resetFilters = () => {
    onFiltersChange({
      sources: [],
      categories: [],
      keyword: '',
      dateFrom: undefined,
      dateTo: undefined,
      minScore: undefined,
    });
  };

  const hasActiveFilters =
    filters.sources.length > 0 ||
    filters.categories.length > 0 ||
    filters.keyword.trim() !== '' ||
    filters.dateFrom ||
    filters.dateTo ||
    filters.minScore !== undefined;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white border rounded-xl p-5 space-y-6 shadow-sm sticky top-6"
    >
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
            <Filter className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            フィルター
          </h2>
        </div>
        <AnimatePresence>
          {hasActiveFilters && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
            >
              <Button variant="ghost" size="sm" onClick={resetFilters} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                <X className="h-4 w-4 mr-1" />
                リセット
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ソース選択 */}
      <div>
        <h3 className="font-semibold text-sm mb-3 text-gray-700">ソース</h3>
        <div className="flex flex-wrap gap-2">
          {sources.map((source, i) => (
            <motion.button
              key={source}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleSource(source)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all uppercase ${
                filters.sources.includes(source)
                  ? `bg-gradient-to-r ${sourceGradients[source]} text-white shadow-md`
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {source}
            </motion.button>
          ))}
        </div>
      </div>

      {/* キーワード検索 */}
      <div>
        <h3 className="font-semibold text-sm mb-3 text-gray-700 flex items-center gap-2">
          <Search className="h-4 w-4" />
          キーワード検索
        </h3>
        <Input
          type="text"
          value={filters.keyword}
          onChange={(e) =>
            onFiltersChange({ ...filters, keyword: e.target.value })
          }
          placeholder="タイトル、説明、タグで検索..."
          className="w-full"
        />
      </div>

      {/* カテゴリ/タグ選択 */}
      <div>
        <h3 className="font-semibold text-sm mb-3 text-gray-700">カテゴリ/タグ</h3>
        <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-2 scrollbar-thin">
          {availableCategories.map((category, i) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.02 }}
            >
              <Badge
                variant={filters.categories.includes(category) ? "default" : "outline"}
                className={`cursor-pointer transition-all hover:scale-105 ${
                  filters.categories.includes(category)
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0'
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => toggleCategory(category)}
              >
                {category}
              </Badge>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 日付範囲 */}
      <div>
        <h3 className="font-semibold text-sm mb-3 text-gray-700 flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          日付範囲
        </h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-600 font-medium mb-1 block">開始日</label>
            <Input
              type="date"
              value={filters.dateFrom?.toISOString().split('T')[0] || ''}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  dateFrom: e.target.value ? new Date(e.target.value) : undefined,
                })
              }
              className="w-full text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-600 font-medium mb-1 block">終了日</label>
            <Input
              type="date"
              value={filters.dateTo?.toISOString().split('T')[0] || ''}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  dateTo: e.target.value ? new Date(e.target.value) : undefined,
                })
              }
              className="w-full text-sm"
            />
          </div>
        </div>
      </div>

      {/* 人気度（最小スコア） */}
      <div>
        <h3 className="font-semibold text-sm mb-3 text-gray-700 flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          最小人気度
        </h3>
        <Input
          type="number"
          value={filters.minScore ?? ''}
          onChange={(e) =>
            onFiltersChange({
              ...filters,
              minScore: e.target.value ? Number(e.target.value) : undefined,
            })
          }
          placeholder="最小スコア..."
          min="0"
          className="w-full"
        />
      </div>
    </motion.div>
  );
}
