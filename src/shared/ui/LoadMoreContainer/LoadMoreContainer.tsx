import React, { ReactNode, memo } from 'react';
import { useTranslation } from 'next-i18next';
import { Button } from '../Button/Button';
import classes from './loadMore.module.scss';


interface loadMoreContainerProps {
  loadMore: () => void,
  hasMore: boolean,
  children: ReactNode,
  containerClassName?: string,
}

const LoadMoreContainer = ({ loadMore, hasMore, children, containerClassName }: loadMoreContainerProps) => {
  const { t } = useTranslation();

  return (
    <div className={`${classes.loadMoreContainer} ${containerClassName}`}>
      {children}
      {hasMore && <Button onClick={loadMore}>{t('loadMore')}</Button>}
    </div>
  );
};


export default memo(LoadMoreContainer, (prevProps, nextProps) => {
  return prevProps.hasMore === nextProps.hasMore &&
   prevProps.loadMore === nextProps.loadMore;
});
