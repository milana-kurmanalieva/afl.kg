import React, { FC } from 'react';
import Image from 'next/image';
import burger from '@/icons/filter_icon.svg';
import close from '@/icons/x.svg';
import classes from './burgerFilterButton.module.scss';


interface IBurgerFilterButton {
  onToggle: () => void;
  isOpen: boolean;
}

export const BurgerFilterButton: FC<IBurgerFilterButton> = ({ onToggle, isOpen }) => {

  return (
    <div
      className={`${classes.burgerButton} ${isOpen ? classes.isActive : ''}`}
    >
      {
        isOpen ?
          <div className={classes.close} >
            <p className={classes.title}>Фильтр</p>
            <Image src={close} alt="close" className={classes.image} onClick={onToggle}/>
          </div>
          :
          <div className={classes.burger} onClick={onToggle}>
            <Image src={burger} alt="burger"/>
            <span className={classes.title}>Фильтр</span>
          </div>
      }
    </div>
  );
};
