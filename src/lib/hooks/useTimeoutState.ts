import { useCallback, useRef, useState } from "react";

export default function useTimeoutState<T>(
  initialValue: T,
  timeout: number
): [T, (newValue: T) => void] {
  const [value, setValue] = useState<T>(initialValue);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const updateValue = useCallback(
    (newValue: T) => {
      setValue(newValue);
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setValue(initialValue);
      }, timeout);
    },
    [timeout, initialValue]
  );

  return [value, updateValue];
}
