import React, { FC } from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { PATHS } from '@/shared/lib/constants/constants';
import classes from './modal.module.scss';
import { IPlayerInfo } from './PlayerInfoModal';


interface IPlayerStats {
  player: IPlayerInfo;
}

export const PlayerStats:FC<IPlayerStats> = ({ player }) => {
  const { t } = useTranslation();
  const stats = [
    {
      label: t('team'),
      value: <Link href={`${PATHS.teams}/${player.team_id}`}>{player.team_name}</Link>,
    },
    { label: t('division'), value: player.division_name },
    { label: t('position'), value: player.position },
    { label: t('birthDate'), value: player.birth_date },
    { label: t('citizenship'), value: player.citizenship },
    { label: t('status'), value: player.transfer_status },
    { label: t('height'), value: `${player.height} см` },
    { label: t('weight'), value: `${player.weight} кг` },
    { label: t('number'), value: player.number },
  ];

  return (
    <div className={classes.stats}>
      <ul>
        {stats.map(stat => (
          stat.value && <li key={stat.label}>
            <p className={classes.label}>{stat.label}:</p>
            <span className={classes.value}>{stat.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
