import { Error, REQUEST_STATUSES, Status } from '@/shared/lib/constants/constants';
import { ITeam } from '@/shared/ui/Teams/TeamsList/TeamsList';


export interface ITeamsState {
  teamsResponse: {
    count: number,
    next: null | string,
    previous: null | string,
    results: ITeam[ ]
  };
  teamsStatus: Status;
  teamsError: Error;

  teamsList: ITeam[];
  teamsListStatus: REQUEST_STATUSES;
  teamsListError: Error
}

export interface IParams {
  leagueId: number,
  search?: string,
  limit?: number,
  offset?: number,
  division: number
}
