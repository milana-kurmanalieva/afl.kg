import { useEffect, useState } from 'react';


export const useInnerWidthExceedsDefault = (): boolean => {
  const mobileSizeScreen = 820;
  const [ exceedsDefault, setExceedsDefault ] = useState<boolean>(
    window.innerWidth < mobileSizeScreen,
  );

  useEffect(() => {
    const handleResize = () => {
      setExceedsDefault(window.innerWidth < mobileSizeScreen);
    };
    window.addEventListener('resize', handleResize);

    setExceedsDefault(window.innerWidth < mobileSizeScreen);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [ mobileSizeScreen ]);

  return exceedsDefault;
};
