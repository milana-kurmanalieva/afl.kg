import React, { memo } from 'react';
import { useTranslation } from 'next-i18next';
import NewsCard from '@/shared/ui/News/NewsCard/NewsCard';
import { PATHS, styleVariants } from '@/shared/lib/constants/constants';
import { HTag } from '@/shared/ui/HTag/HTag';
import { NewsSkeletonCard } from '@/shared/ui/Skeleton/NewsSkeleton/NewsSkeletonCard';
import { NewsItem } from '@/entities/News/type/newsSchema';
import { PhotoGallery } from '@/entities/PhotoGallery/type/photoGallerySchema';
import useIsMobile from '@/shared/lib/hooks/useIsMobile';
import Loader from '../../loader/Loader';
import classes from './newsList.module.scss';


interface NewsListProps {
  cardVariant?: styleVariants;
  listVariant?: styleVariants;
  newsList: Array<NewsItem | PhotoGallery | PhotoGallery>;
  isLoading?: boolean;
  title?: boolean | string;
  onOpen?: (id: number) => void;
  isAbleToShare?: boolean;
  shareRoute?: string;
}

const NewsList = (props:NewsListProps) => {
  const { t } = useTranslation();
  const {
    cardVariant = styleVariants.small,
    listVariant = styleVariants.small,
    isLoading,
    newsList,
    title = t('readAlso'),
    onOpen,
    isAbleToShare = true,
    shareRoute = PATHS.news,
  } = props;

  const isMobile = useIsMobile();

  const limit = isMobile ? 4 : 8;

  return (
    <div className={classes.newsListWrapper}>
      {!!title && <HTag level={4} >{title}</HTag>}

      {(newsList.length === 0 && !isLoading) && <Loader center/>}

      <ul className={classes[ listVariant + 'List' ]}>
        {!!newsList.length && newsList.map(newsItem => (
          <NewsCard
            variant={cardVariant}
            newsItem={newsItem}
            key={newsItem.id}
            onOpen={onOpen}
            isAbleToShare={isAbleToShare}
            shareRoute={shareRoute}
          />
        ))}
        {isLoading && [ ...Array(limit) ].map((_, index) => (
          <NewsSkeletonCard variant={cardVariant} key={index}/>
        ))}
      </ul>
    </div>
  );
};


export default memo(NewsList, (prevProps, nextProps) => {
  return prevProps.newsList === nextProps.newsList && prevProps.isLoading === nextProps.isLoading;
});
