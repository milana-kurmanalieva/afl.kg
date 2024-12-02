import { Error, REQUEST_STATUSES, Status } from '@/shared/lib/constants/constants';
import { PersonBase } from '@/shared/ui/Players/PlayerCard/PlayerCard';


export interface IPlayersState {
  playersResponse: {
    count: number,
    next: null | string,
    previous: null | string,
    results: PersonBase[ ]
  };
  playersStatus: Status;
  playersError: Error;

  playersList: PersonBase[];
  playersListStatus: REQUEST_STATUSES;
  playersListError: Error
}

export interface IParams {
  leagueId: number,
  search?: string,
  limit?: number,
  offset?: number,
  letter?: string,
}
