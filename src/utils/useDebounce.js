import { useRef } from "react";

const useDebounce = (callback, delay) => {
  const timeoutRef = useRef(null);
  return (...searchValue) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      callback(...searchValue);
    }, delay);
  };
};

export default useDebounce;
