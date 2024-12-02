import React from 'react';
import { Skeleton } from '../Skeleton';
import classes from './sponsors.module.scss';


export const SponsorsSkeletonCard = () => {
  return (
    <div className={classes.main}>
      <Skeleton width={ '100%'} height={ '100%'} />
    </div>
  );
};
