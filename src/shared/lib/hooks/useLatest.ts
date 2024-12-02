import { useEffect, useRef } from 'react';


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useLatest = (value: any) => {
  const valueRef = useRef(value);

  useEffect(() => {
    valueRef.current = value;
  }, [ value ]);

  return valueRef;
};
