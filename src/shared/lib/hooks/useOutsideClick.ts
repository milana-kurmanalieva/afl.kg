import { useEffect } from 'react';
import { useLatest } from './useLatest';


type handlerType = () => void;

export function useOutsideClick <T>(elemRef: {current: T}, handler: handlerType, attached: boolean) {
  const latestHandler = useLatest(handler);

  useEffect(() => {
    if (!attached) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleClick = (e: any) => {
      if (!elemRef.current || !(elemRef.current instanceof HTMLElement)) return;

      if (!elemRef.current.contains(e.target)) {
        latestHandler.current();
      }
    };

    const timeout = setTimeout(() => document.addEventListener('click', handleClick));

    return () => {
      document.removeEventListener('click', handleClick);
      clearTimeout(timeout);
    };

  }, [
    attached,
    latestHandler,
    elemRef,
  ]);
}
