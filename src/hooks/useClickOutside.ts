import { useEffect, RefObject } from 'react';

type OutsideRef = RefObject<HTMLElement> | RefObject<HTMLElement>[];

export function useClickOutside(
  ref: OutsideRef,
  callback: () => void,
  isActive: boolean = true
) {
  useEffect(() => {
    if (!isActive) return;

    const handleClickOutside = (event: MouseEvent | PointerEvent) => {
      const refs = Array.isArray(ref) ? ref : [ref];
      const isInsideAnyRef = refs.some(item =>
        item.current?.contains(event.target as Node)
      );
      if (!isInsideAnyRef) {
        callback();
      }
    };

    document.addEventListener('pointerdown', handleClickOutside);
    return () =>
      document.removeEventListener('pointerdown', handleClickOutside);
  }, [ref, callback, isActive]);
}
