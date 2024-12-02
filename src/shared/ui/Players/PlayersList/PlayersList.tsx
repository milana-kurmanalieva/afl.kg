import React, { FC } from 'react';
import { CardPersonVariant } from '@/shared/lib/constants/constants';
import { PersonBase, PlayerCard } from '../PlayerCard/PlayerCard';
import { PlayerSkeletonCard } from '../PlayerCard/PlayerSkeletonCard';
import classes from './players.module.scss';


interface IPlayerList {
  players: PersonBase[];
  isLoading?: boolean;
  variant?: CardPersonVariant;
  isAbleToOpenCard?: boolean;
}

const limit = 18;

export const PlayersList:FC<IPlayerList> = ({ players, isLoading, variant, isAbleToOpenCard = false }) => {
  if (!!players.length) {
    return (
      <ul
        className={classes.players}
      >
        {players?.map(player => (
          <PlayerCard
            isAbleToOpen={isAbleToOpenCard}
            key={player.id}
            player={player}
            variant={variant}
          />
        ))}
        {isLoading && [ ...Array(limit) ].map((_, index) => (
          <PlayerSkeletonCard key={index}/>
        ))}
      </ul>
    );
  }

  return null;
};
