import React from 'react';
import { Skeleton } from '../../Skeleton/Skeleton';
import classes from './teamCard.module.scss';


export const TeamCardSkeleton = () => {

  return (
    <Skeleton clsName={classes.skeleton}/>
  );
};
