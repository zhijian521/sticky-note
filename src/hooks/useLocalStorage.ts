import { useState, useEffect, useRef, useCallback } from 'react';

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, boolean] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isLoaded, setIsLoaded] = useState(false);
  const isInitialized = useRef(false);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(`读取 localStorage 键 "${key}" 失败：`, error);
    } finally {
      setIsLoaded(true);
      isInitialized.current = true;
    }
  }, [key]);

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        setStoredValue(prev => {
          const valueToStore =
            value instanceof Function ? value(prev) : value;
          if (isInitialized.current) {
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
          }
          return valueToStore;
        });
      } catch (error) {
        console.error(`写入 localStorage 键 "${key}" 失败：`, error);
      }
    },
    [key]
  );

  return [storedValue, setValue, isLoaded];
}
