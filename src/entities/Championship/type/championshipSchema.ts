import { DivisionOption } from '@/entities/Divisions/type/divisionSchema';
import { Error, FilterSelectOption, Status } from '@/shared/lib/constants/constants';


export interface getChampionshipsParams {
  leagueId: number;
}

export interface getToursParams {
  division: DivisionOption;
}

export interface Championship {
  id: number;
  season: string;
  year: number;
}

export interface championshipsState {
  championships: Array<Championship>;
  championshipsError: Error;
  championshipsStatus: Status;

  tours: Array<FilterSelectOption>;
  toursError: Error;
  toursStatus: Status;

  currentTour: FilterSelectOption;
}
