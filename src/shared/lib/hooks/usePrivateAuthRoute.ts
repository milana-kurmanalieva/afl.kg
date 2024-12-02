import { getCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { IS_AUTHORIZED, PATHS } from '../constants/constants';


const usePrivateAuthRoute = () => {
  const router = useRouter();
  const isAuthorized = getCookie(IS_AUTHORIZED);

  useEffect(() => {
    if (!isAuthorized) router.push(PATHS.home);
  }, [ isAuthorized ]);
};

export default usePrivateAuthRoute;
