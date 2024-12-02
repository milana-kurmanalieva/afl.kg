import React, { ReactNode } from 'react';
import { Directions } from '@/shared/lib/constants/constants';
import { DoubleArrow } from '../DoubleArrow/DoubleArrow';
import classes from './showMore.module.scss';


interface IBottomShowMore {
  hasNext?: boolean;
  handleNext?: () => void;
  children: ReactNode;
}

export const BottomShowMore = ({ hasNext = true, handleNext, children }: IBottomShowMore) => {

  return (
    <button onClick={handleNext} className={classes.next}>
      <p>{children}</p>
      <DoubleArrow direction={hasNext ? Directions.left : Directions.right}/>
    </button>
  );
};
