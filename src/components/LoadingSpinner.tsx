import { motion } from 'framer-motion';

export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative w-24 h-24">
        {/* 外側の円 */}
        <motion.div
          className="absolute inset-0 border-4 border-transparent border-t-blue-500 border-r-purple-500 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />

        {/* 中間の円 */}
        <motion.div
          className="absolute inset-2 border-4 border-transparent border-t-cyan-500 border-r-pink-500 rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />

        {/* 内側の円 */}
        <motion.div
          className="absolute inset-4 border-4 border-transparent border-t-indigo-500 border-r-orange-500 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        />

        {/* 中心の点 */}
        <motion.div
          className="absolute inset-0 m-auto w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [1, 0.7, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <motion.p
        className="mt-6 text-gray-600 text-lg font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        データを読み込んでいます...
      </motion.p>

      {/* 点滅するドット */}
      <div className="flex gap-2 mt-4">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );
}
