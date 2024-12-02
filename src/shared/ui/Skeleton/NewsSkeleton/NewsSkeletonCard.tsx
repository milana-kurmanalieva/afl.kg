import React from 'react';
import { Skeleton } from '@/shared/ui/Skeleton/Skeleton';
import { styleVariants } from '@/shared/lib/constants/constants';
import classes from './news.module.scss';


interface NewsSkeletonCardProps {
  variant?: styleVariants;
}

export const NewsSkeletonCard = ({ variant = styleVariants.small }:NewsSkeletonCardProps) => {
  const clsName = variant + 'NewsSkeleton';

  return (
    <Skeleton clsName={classes[ clsName ]}/>
  );
};
