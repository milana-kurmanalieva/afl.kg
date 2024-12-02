import React, { ButtonHTMLAttributes, FC, ReactNode } from 'react';
import classes from './addButton.module.scss';


interface Props extends Partial<ButtonHTMLAttributes<HTMLButtonElement>>{
  children: ReactNode;
}

export const AddButton: FC<Props> = ({ children, ...rest }) => {
  return (
    <button
      {...rest}
      type='button'
      className={`${classes.addBtn} ${rest.className}`}
    >
      + {children}
    </button>
  );
};
