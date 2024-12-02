import React, { FC } from 'react';
import { useRouter } from 'next/router';
import { PATHS } from '@/shared/lib/constants/constants';
import { useAppSelector } from '@/app/providers/StoreProvider';
import { useUserDefaultProfileRoute } from '@/shared/lib/hooks/useUserDefaultProfileRoute';
import { selectAuth } from '../model/authSlice';
import { Avatar } from './Avatar';
import { LoginButton } from './LoginButton';


interface IProfileButton {
  className?: string;
  showAvatar?: boolean
  showButton?: boolean;
}

const ProfileButton:FC<IProfileButton> = ({ className = '', showAvatar = true, showButton = true }) => {
  const router = useRouter();
  const { user } = useAppSelector(selectAuth);

  const userDefaultProfileRoute = useUserDefaultProfileRoute();

  const navigate = () => {
    router.push(user ? userDefaultProfileRoute : PATHS.signIn);
  };

  return (
    <div className={className}>
      {user ? showAvatar && <Avatar onClick={navigate}/> :
        showButton && <LoginButton className={className} onClick={navigate}/>}
    </div>
  );
};

export default ProfileButton;
