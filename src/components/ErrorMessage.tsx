import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { motion } from 'framer-motion';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white border-2 border-red-200 rounded-xl p-10 text-center shadow-lg"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
        className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center"
      >
        <AlertCircle className="h-10 w-10 text-red-600" />
      </motion.div>

      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-xl font-bold text-gray-900 mb-3"
      >
        エラーが発生しました
      </motion.h3>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-gray-600 mb-6 max-w-md mx-auto"
      >
        {message}
      </motion.p>

      {onRetry && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            onClick={onRetry}
            className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            再試行
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
