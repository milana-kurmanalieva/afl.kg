import React, { FC } from 'react';
import classes from './burgerBtn.module.scss';


interface IBurgerButton {
  onToggle: () => void;
  isOpen: boolean;
}

export const BurgerButton: FC<IBurgerButton> = ({ onToggle, isOpen }) => {
  return (
    <button
      onClick={onToggle}
      className={`${classes.burgerButton} ${isOpen ? classes.isActive : ''}`}
    >
      <span className={classes.line}/>
      <span className={classes.line}/>
      <span className={classes.line}/>
    </button>

  );
};
