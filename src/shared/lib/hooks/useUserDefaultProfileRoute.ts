import { useAppSelector } from '@/app/providers/StoreProvider';
import { selectAuth } from '@/entities/Auth/model/authSlice';
import { PATHS } from '../constants/constants';
import useIsMobile from './useIsMobile';


export const useUserDefaultProfileRoute = () => {
  const { user } = useAppSelector(selectAuth);
  const isMobile = useIsMobile();
  const userDefaultProfileRoute = isMobile ? PATHS.profile :
    user?.is_business_owner ? PATHS.profileFields : PATHS.profileSettings;
  return userDefaultProfileRoute;
};
