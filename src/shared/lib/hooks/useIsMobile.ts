import { useState, useEffect } from 'react';


const useIsMobile = () => {
  const [ isMobile, setIsMobile ] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMobile(window.innerWidth <= 820);
    }
  }, []);


  return isMobile;
};

export default useIsMobile;
