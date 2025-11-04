import { SortType } from '../types';
import { TrendingUp, Clock, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from './ui/badge';

interface SortBarProps {
  sortType: SortType;
  onSortChange: (sortType: SortType) => void;
  resultCount: number;
}

export function SortBar({ sortType, onSortChange, resultCount }: SortBarProps) {
  const sortOptions: { value: SortType; label: string; icon: React.ReactNode; gradient: string }[] = [
    { value: 'trend', label: 'トレンド', icon: <TrendingUp className="h-4 w-4" />, gradient: 'from-orange-500 to-red-500' },
    { value: 'recent', label: '新着順', icon: <Clock className="h-4 w-4" />, gradient: 'from-blue-500 to-cyan-500' },
    { value: 'favorite', label: 'お気に入り', icon: <Heart className="h-4 w-4" />, gradient: 'from-pink-500 to-red-500' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border rounded-xl p-5 flex items-center justify-between shadow-sm"
    >
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 px-3 py-1">
          {resultCount}
        </Badge>
        <span className="text-sm text-gray-600 font-medium">件の結果</span>
      </div>

      <div className="flex gap-2">
        {sortOptions.map((option, i) => (
          <motion.button
            key={option.value}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSortChange(option.value)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
              sortType === option.value
                ? `bg-gradient-to-r ${option.gradient} text-white shadow-md`
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow'
            }`}
          >
            {option.icon}
            {option.label}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
