import React from 'react';
import { Skeleton } from '../../Skeleton/Skeleton';
import classes from './player.module.scss';


export const PlayerSkeletonCard = () => {
  return (
    <Skeleton clsName={classes.skeleton}/>
  );
};
