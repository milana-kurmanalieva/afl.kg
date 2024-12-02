import React, { FC } from 'react';
import { useTranslation } from 'next-i18next';
import { StyleType } from '@/shared/lib/constants/constants';
import { BottomShowMore } from '../BottomShowMore/BottomShowMore';
import classes from './matches.module.scss';
import { MatchItem } from './MatchItem';
import { MatchesType } from './MatchFinall';


interface IMatchesList {
  matches: Array<MatchesType>;
  handlePaginate?: () => void;
  hasNext?: boolean;
  pagination?: boolean;
  showTour?: boolean;
  isDisabled?: boolean;
}


export const MatchesList:FC<IMatchesList> = ({
  matches,
  pagination,
  hasNext,
  handlePaginate,
  showTour,
}) => {
  const { t } = useTranslation();
  let itemsCount = 1;
  let rowCount = 0;
  return (
    <>
      <ul className={classes.results}>
        {matches?.length > 0 && matches.map(match => {

          itemsCount ++;

          if (itemsCount % 2 === 0) {
            rowCount ++;
          }

          const type = rowCount % 2 === 0 ? StyleType.secondary : StyleType.primary;

          return (
            <MatchItem
              key={match?.id}
              match={match}
              type={type}
              status={match?.status}
              label={showTour ? String(match?.tour) : ''}
            />
          );
        })}
      </ul>
      <div className={classes.pagination}>
        {matches?.length > 0 && pagination && (
          <BottomShowMore
            hasNext={hasNext}
            handleNext={handlePaginate}
          > {hasNext ? t('next') : t('prev')}
          </BottomShowMore>
        )}
      </div>
    </>
  );
};
