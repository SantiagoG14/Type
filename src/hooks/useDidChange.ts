import { useEffect, useRef } from "react";

export function useDidChange(fn: () => void, ...args: unknown[]) {
  const isMounting = useRef(false);

  useEffect(() => {
    isMounting.current = true;
  }, []);

  useEffect(() => {
    if (!isMounting.current) {
      console.log("here");
      return fn();
    } else {
      isMounting.current = false;
    }
  }, args);
}
