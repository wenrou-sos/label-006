import { useEffect, useRef } from "react";
import { useQueueStore } from "@/store/queueStore";

export const usePolling = (interval = 2000) => {
  const touch = useQueueStore((s) => s.touch);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      touch();
    }, interval);

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [interval, touch]);
};

export const useClock = () => {
  return;
};
