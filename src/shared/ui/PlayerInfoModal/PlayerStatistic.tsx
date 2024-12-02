import React, { FC } from 'react';
import { useTranslation } from 'next-i18next';
import { IPlayerInfo } from './PlayerInfoModal';
import classes from './modal.module.scss';


export interface Statistics {
  id:number,
  first_name: string,
  last_name: string,
  team: string,
  goals:number,
  games:number,
  assists:number,
  yel_cards:number,
  red_cards:number,
  rating: number;
}

interface IPlayerStatistic {
  stats: IPlayerInfo | Statistics;
}

export const PlayerStatistic:FC<IPlayerStatistic> = ({ stats }) => {
  const { t } = useTranslation();

  const statistics = [
    { label: t('gamesLabel'), value: stats.games },
    { label: t('goalsLabel'), value: stats.goals },
    { label: t('assistsLabel'), value: stats.assists },
    { label: t('yellowCardLabel'), value: stats.yel_cards },
    { label: t('redCardLabel'), value: stats.red_cards },
    { label: t('ratingLabel'), value: stats.rating },
  ];

  return (
    <div className={classes.statistic}>
      <ul>
        {statistics.map(item => (
          <li key={item.label} data-full-label={'full label'}>
            <p className={classes.label}>{item.label}</p>
            <p className={classes.value}>{item.value}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
