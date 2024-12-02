import React, { FC, memo } from 'react';
import { useTranslation } from 'next-i18next';
import { BestPlayerVariant, CardPersonVariant } from '@/shared/lib/constants/constants';
import { PersonBase, PlayerCard } from '../Players/PlayerCard/PlayerCard';
import { HTag } from '../HTag/HTag';
import classes from './ArchiveBanner.module.scss';


interface IBannerProps {
  bestPlayer?: PersonBase,
  bestBombardier?: PersonBase,
  variant?: BestPlayerVariant
}

export const ArchiveBanner: FC<IBannerProps> = ({ bestPlayer, bestBombardier, variant }) => {
  const { t } = useTranslation();
  return (
    <div className={classes.cupBanner}>
      <div className={variant === BestPlayerVariant.ONE_PLAYER ? classes.ratingCardWrap : classes.ratingCardWrapper}>
        {bestPlayer && <div className={classes.ratingCard}>
          <HTag level={4}>
            {t('bestPlayer')}
          </HTag>
          <PlayerCard
            isAbleToOpen
            variant={CardPersonVariant.PLAYERS}
            player={bestPlayer}
          />
        </div>}
        {bestBombardier && <div className={classes.ratingCard}>
          <HTag level={4}>
            {t('bestBombardier')}
          </HTag>
          <PlayerCard
            isAbleToOpen
            variant={CardPersonVariant.PLAYERS}
            player={bestBombardier}
          />
        </div>}
      </div>
    </div>
  );
};

export default memo(ArchiveBanner, (prevProps, nextProps) => {
  return prevProps.bestBombardier === nextProps.bestBombardier && prevProps.bestPlayer === nextProps.bestPlayer;
});
