import { Error, FilterSelectOption, REQUEST_STATUSES } from '@/shared/lib/constants/constants';


export interface currentLeagueState {
  leagueId: number;
  currentLeague: {
    title: string;
    id: number;
    logo?: string;
  };
  leagues: FilterSelectOption[];
  leaguesStatus: REQUEST_STATUSES;
  leaguesError: Error;
}
