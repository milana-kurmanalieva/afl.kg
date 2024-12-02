import React, { FC } from 'react';
import { useTranslation } from 'next-i18next';
import { NewsItem } from '@/entities/WorldNews/type/worldNewsSchema';
import { PATHS, styleVariants } from '@/shared/lib/constants/constants';
import useIsMobile from '@/shared/lib/hooks/useIsMobile';
import { EmptyState } from '../../EmptyState/EmptyState';
import NewsCard from '../NewsCard/NewsCard';
import { HTag } from '../../HTag/HTag';
import { ShowAllLink } from '../../ShowAllLink/ShowAllLink';
import FootballFieldsCard from '../../FootballFieldsCard/FootballFieldsCard';
import SportShopsCard from '../../SportShopsCard/SportShopsCard';
import classes from './side.module.scss';


interface INewsSideWidget {
  list: NewsItem[],
}

export const NewsSideWidget: FC<INewsSideWidget> = ({ list }) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  return (
    <>
      {
        !isMobile &&
        <div className={classes.globalNewsList}>
          <div className={classes.globalTitle}>
            {isMobile ?
              <HTag level={3}>{t('leagueNews')}</HTag> :
              <HTag level={5} myClass={classes.title}>
                {t('leagueNews')}
              </HTag>
            }
          </div>
          <ul>
            <FootballFieldsCard/>
            <SportShopsCard/>
            {!!list.length && list.map(item => (
              <NewsCard newsItem={item} key={item.id} variant={styleVariants.small}/>
            ))}

            {!list.length && <EmptyState/>}
          </ul>
          {isMobile && <ShowAllLink isSection className={classes.link} href={PATHS.worldNews}/>}
        </div>
      }
    </>
  );
};
