import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

/**
 * 프로젝트 전반에서 재사용 가능한 커스텀 스타일 토스트
 * @param message 토스트에 표시할 메시지
 */
export const showCustomToast = (message: string) => {
  toast.custom(
    (t) => (
      <AnimatePresence>
        {t.visible && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 40,
              mass: 0.1,
            }}
            // 더 밝고 투명한 배경 (#8C7B70/80)
            className="flex items-center justify-center w-[320px] md:w-[440px] h-[88px] bg-[#8C7B70]/80 backdrop-blur-md rounded-[8px] pointer-events-auto shadow-lg mb-[20vh]"
          >
            <span className="text-White subhead_4_1 text-[18px]">{message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    ),
    { duration: 2000, position: "bottom-center" }
  );
};
