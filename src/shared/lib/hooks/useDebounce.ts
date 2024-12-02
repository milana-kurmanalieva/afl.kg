/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from 'react';
import { useLatest } from './useLatest';


type Timer = ReturnType<typeof setTimeout>;
type callback = (...args: any) => any;

const debounce = (callback: callback, delay: number) => {
  let timeout:null | Timer = null;

  return (...args: any) => {
    timeout && clearTimeout(timeout);
    timeout = setTimeout(() => {
      callback(...args);
    }, delay);
  };
};

export const useDebounce = (callback: callback, delay: number) => {
  const func = useLatest(callback);

  return useMemo(() => debounce((...args) => {
    func.current(...args);
  }, delay),
  [ delay, func ],
  );
};
