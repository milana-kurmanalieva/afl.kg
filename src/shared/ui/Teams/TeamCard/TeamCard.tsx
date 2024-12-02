import React, { FC } from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { ITeam } from '../TeamsList/TeamsList';
import classes from './teamCard.module.scss';


interface ITeamCard {
  team: ITeam;
}

export const TeamCard:FC<ITeamCard> = ({ team }) => {
  const { t } = useTranslation();

  return (
    <li className={classes.card}>
      <Link href={`/teams/${team?.id}`}>
        <img
          src={team.logo}
          alt={team.name}
        />
        <h3>{team?.name}</h3>
        <p>{t('captain')}: {team?.captain}</p>
      </Link>
    </li>
  );
};
