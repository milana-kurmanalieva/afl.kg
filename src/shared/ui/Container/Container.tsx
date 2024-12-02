import React, { ReactNode } from 'react';
import classes from './container.module.scss';


interface ContainerProps {
  variant?: 'mid' | 'small' | 'large';
  children: ReactNode;
}

export const Container = ({ variant = 'mid', children }:ContainerProps) => {
  return (
    <div className={classes[ variant + 'Container' ]}>
      {children}
    </div>
  );
};
