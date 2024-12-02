import { FC, ReactNode } from 'react';
import { DesktopLogo } from '../Logo/Logo';
import classes from './auth.module.scss';


interface AuthLayoutProps {
  children: ReactNode;
  isError?: boolean;
}

const AuthLayout:FC<AuthLayoutProps> = ({ children, isError }) => {
  return (
    <div className={classes.wrapper}>
      <DesktopLogo/>
      <div className={classes.formWrapper} style={{ border: isError ? '1px solid #F41414' : '' }}>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
