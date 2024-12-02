import React, { FC } from 'react';
import { SearchResult } from '@/shared/lib/constants/constants';
import { TeamCard } from '../TeamCard/TeamCard';
import { TeamCardSkeleton } from '../TeamCard/TeamCardSkeleton';
import classes from './teams.module.scss';


export interface ITeam extends SearchResult {
  id: number;
  name: string;
  logo: string;
  captain: string;
}


interface ITeamsList {
  teamsList: ITeam[];
  limit?: number;
  isLoading?: boolean;
}

export const TeamsList:FC<ITeamsList> = ({
  limit = 8,
  teamsList,
  isLoading,
}) => {
  return (
    <div className={classes.newsListWrapper}>
      <ul className={classes.list}>
        {!!teamsList?.length && teamsList.map(team => (
          <TeamCard
            team={team}
            key={team.id}
          />
        ))}
        {isLoading && [ ...Array(limit) ].map((_, index) => (
          <TeamCardSkeleton key={index}/>
        ))}
      </ul>
    </div>
  );
};
