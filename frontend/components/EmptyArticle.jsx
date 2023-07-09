import { motion } from "framer-motion";

const accentColor = "#F39887";

export const EmptyArticle = ({ delay }) => {
  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      className="relative flex-auto h-fit md:h-full md:w-full lg:w-full shadow-sm bg-[#f0f0f0] dark:bg-[#1f1f1f] rounded-sm shadow-md rounded-lg"
    >
      <div>
        <a target="_blank">
          <div className="p-4">
            <div
              className={`h-60 w-full bg-zinc-800 rounded-md animate-pulse animation-delay-${delay}`}
            />
            <div className="h-36 pt-4 flex-col items-center"></div>
          </div>
        </a>
      </div>
    </motion.div>
  );
};
