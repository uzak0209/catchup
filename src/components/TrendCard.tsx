import { TrendItem } from '../types';
import { Heart, MessageCircle, ExternalLink, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { motion } from 'framer-motion';

interface TrendCardProps {
  item: TrendItem;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  index?: number;
}

export function TrendCard({ item, isFavorite, onToggleFavorite, index = 0 }: TrendCardProps) {
  const sourceGradients = {
    zenn: 'from-blue-500 to-cyan-500',
    github: 'from-gray-800 to-gray-600',
    reddit: 'from-orange-500 to-red-500',
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}日前`;
    if (hours > 0) return `${hours}時間前`;
    return '1時間以内';
  };

  const formatScore = (score: number) => {
    if (score >= 1000) {
      return `${(score / 1000).toFixed(1)}k`;
    }
    return score.toString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="group relative"
    >
      <div className="border rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
        {/* グラデーションバー */}
        <div className={`h-1 bg-gradient-to-r ${sourceGradients[item.source]}`} />

        {/* サムネイル */}
        {item.thumbnailUrl && (
          <div className="h-40 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 relative">
            <img
              src={item.thumbnailUrl}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        )}

        <div className="p-5 flex-1 flex flex-col">
          {/* ソースバッジとお気に入りボタン */}
          <div className="flex items-center justify-between mb-3">
            <Badge variant="secondary" className={`bg-gradient-to-r ${sourceGradients[item.source]} text-white border-0 uppercase font-bold text-xs`}>
              {item.source}
            </Badge>
            <motion.div whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleFavorite(item.id)}
                className="h-9 w-9 p-0 rounded-full hover:bg-red-50"
              >
                <motion.div
                  animate={isFavorite ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <Heart
                    className={`h-5 w-5 transition-colors ${
                      isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-400'
                    }`}
                  />
                </motion.div>
              </Button>
            </motion.div>
          </div>

          {/* タイトル */}
          <h3 className="font-bold text-lg mb-2 line-clamp-2 text-gray-900 group-hover:text-blue-600 transition-colors">
            {item.title}
          </h3>

          {/* 説明 */}
          {item.description && (
            <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
              {item.description}
            </p>
          )}

          {/* タグ */}
          <div className="flex flex-wrap gap-2 mb-4">
            {item.tags.slice(0, 3).map((tag, i) => (
              <motion.div
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + i * 0.05 }}
              >
                <Badge variant="outline" className="text-xs bg-gray-50/50 hover:bg-gray-100 transition-colors">
                  {tag}
                </Badge>
              </motion.div>
            ))}
            {item.tags.length > 3 && (
              <Badge variant="outline" className="text-xs bg-gray-50/50">
                +{item.tags.length - 3}
              </Badge>
            )}
          </div>

          {/* メタ情報 */}
          <div className="flex items-center justify-between text-sm text-gray-500 mb-4 pt-3 border-t">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 font-medium">
                <TrendingUp className="h-4 w-4 text-orange-500" />
                {formatScore(item.score)}
              </span>
              <span className="flex items-center gap-1.5">
                <MessageCircle className="h-4 w-4 text-blue-500" />
                {item.commentsCount}
              </span>
            </div>
            <span className="text-xs text-gray-400">{formatDate(item.publishedAt)}</span>
          </div>

          {/* 著者とリンク */}
          <div className="flex items-center justify-between pt-3 border-t">
            <span className="text-sm text-gray-600 font-medium">by {item.author}</span>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 flex items-center gap-1.5 text-sm font-medium group/link"
            >
              詳細
              <ExternalLink className="h-4 w-4 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
