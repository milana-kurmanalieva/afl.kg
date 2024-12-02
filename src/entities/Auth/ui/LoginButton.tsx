import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/ui/Button/Button';
import classes from './profile.module.scss';


interface ILoginButton {
  className?: string;
  onClick: () => void;
}

export const LoginButton: FC<ILoginButton> = ({ className, onClick, ...rest }) => {
  const { t } = useTranslation();
  return (
    <Button
      className={`${classes.profileButton} ${className}`}
      onClick={onClick}
      {...rest}
    >
      {t('toComeIn')}
    </Button>
  );
};
