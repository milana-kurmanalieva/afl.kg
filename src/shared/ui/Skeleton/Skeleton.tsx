import React from 'react';
import classes from './skeleton.module.scss';


interface SkeletonProps {
  width?: string;
  height?: string;
  clsName?: string;
}

export const Skeleton = ({ width, height, clsName }:SkeletonProps) => {
  return <div style={{ width, height }} className={`${classes.skeleton} ${clsName}`}/>;
};
