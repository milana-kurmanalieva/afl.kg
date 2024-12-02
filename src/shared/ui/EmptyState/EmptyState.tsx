import Image from 'next/image';
import React, { FC } from 'react';
// eslint-disable-next-line import/named
import { useTranslation } from 'next-i18next';
import emptyImage from '@/images/emptyState.png';
import classes from './empty.module.scss';


export const EmptyState:FC = () => {
  const { t } = useTranslation();
  return (
    <div className={classes.emptyBlock}>
      <Image
        src={emptyImage}
        alt='empty state'
        width={170}
        height={170}
      />
      <h4>{t('defaultEmptyStateTitle')}</h4>
      <p>{t('defaultEmptyStateDescription')}</p>
    </div>
  );
};
