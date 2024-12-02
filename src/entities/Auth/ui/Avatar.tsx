import React, { FC } from 'react';
import profileIcon from '@/icons/profile-icon.svg';
import classes from './profile.module.scss';


interface IAvatar {
  className?: string;
  onClick: () => void;
}

export const Avatar: FC<IAvatar> = ({ className, onClick, ...rest }) => {

  return (
    <img
      className={`${classes.avatar} ${className}`}
      onClick={onClick}
      {...rest}
      src={profileIcon.src}
      alt='profile'
    />
  );
};
