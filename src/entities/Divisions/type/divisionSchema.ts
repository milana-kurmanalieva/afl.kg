import { Error, FilterSelectOption, REQUEST_STATUSES } from '@/shared/lib/constants/constants';
import { PersonBase } from '@/shared/ui/Players/PlayerCard/PlayerCard';


export interface DivisionState {
  divisions: Array<DivisionOption>;
  divisionsError?: Error;
  divisionsStatus?: REQUEST_STATUSES;

  currentDivision: DivisionOption;

  divisionMatches: [],
  divisionMatchesError: Error,
  divisionMatchesStatus: REQUEST_STATUSES,

  divisionTable: [],
  divisionTableError: Error,
  divisionTableStatus: REQUEST_STATUSES,

  allDivisionsMatches: MatchWithDivision[],
  allDivisionsMatchesError: Error,
  allDivisionsMatchesStatus: REQUEST_STATUSES;

  archivedDivisions: FilterSelectOption[];
  currentArchivedDivision: FilterSelectOption;
  archivedDivisionsStatus: REQUEST_STATUSES;

  bestTourPlayers: PersonBase[];
  transferredMatches: MatchWithDivision[]
}

export interface DivisionOption extends FilterSelectOption {
  tour: {
    id: number;
    number: number;
    date: string;
  }
}
export interface MatchWithDivision {
  result: {
    data: {
      data: []
    }
  };
  division: DivisionOption
}

export interface getDivisionsParams {
  leagueId: number;
}

export interface getDivisionMatchesParams {
  tour_id: number;
  division_id: number;
}

export interface getDivisionTableParams {
  tour_id: number;
  division_id: number;
}


export interface getArchivedDivisionsParams {
  leagueId: number;
}
