import React, { FC } from 'react';
import { format } from 'date-fns';
import { useTranslation } from 'next-i18next';
import { CardPersonVariant, DATE_FORMAT, backMedia } from '@/shared/lib/constants/constants';
import { useAppDispatch } from '@/app/providers/StoreProvider';
import { setPlayerId } from '@/entities/PlayerDetailed/model/playerDetailsSlice';
import classes from './player.module.scss';


export interface PersonBase extends Partial<IPlayer>, Partial<Referee>, Partial<OurTeam>{
  id: number;
  birth_date: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

export interface IPlayer {
  number: number;
  citizenship: string;
  position: string;
  goals: number;
  assists: number;
  yellow_cards: number;
  red_cards: number;
  team_logo: string;
}
interface Referee {
  category: string;
}

interface OurTeam {
  job: string
}

interface IPlayerCard {
  player: PersonBase;
  variant?: CardPersonVariant;
  isAbleToOpen?: boolean;
}

export const PlayerCard: FC<IPlayerCard> = ({
  variant = CardPersonVariant.PLAYERS, player,
  isAbleToOpen = false,
}) => {
  const { t } = useTranslation();

  const ifCursorInitial = variant === CardPersonVariant.OUR_TEAMS
    || variant === CardPersonVariant.REFEREE;

  const dispatch = useAppDispatch();

  const handleOpenPlayerDetails = () => {
    if (!isAbleToOpen) return;
    dispatch(setPlayerId(player.id));
  };

  return (
    <li
      className={`
        ${classes.player}
        ${ifCursorInitial && classes.cursorInitial}`}
      onClick={handleOpenPlayerDetails}>
      <img
        className={classes.playerImage}
        src={player?.avatar}
        alt='bg'
      />
      {player.team_logo && (
        <img
          className={classes.teamLogo}
          src={!player.team_logo.includes(backMedia) ? `${backMedia}/${player.team_logo}` : player.team_logo }
          alt={t('team') as unknown as string}
        />
      )}
      <h4>{player.last_name}</h4>
      <p className={classes.firstName}>{player.first_name}</p>
      {player?.position && <p className={classes.showPosition}>{player.position}</p>}
      <div className={classes.OptionalPart}>
        <p>{ variant !== CardPersonVariant.PLAYERS ? player.job : ''}</p>
        {variant !== CardPersonVariant.PLAYERS ?
          <p>{
            format(new Date(player.birth_date), DATE_FORMAT)
          }</p> : '' }
      </div>
    </li>
  );
};
