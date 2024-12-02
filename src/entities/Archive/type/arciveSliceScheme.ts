import { ITeam } from '@/entities/Team/type/teamSchema';
import { Status, FilterSelectOption } from '@/shared/lib/constants/constants';
import { PersonBase } from '@/shared/ui/Players/PlayerCard/PlayerCard';


export interface ICupsRead {
  best_player: PersonBase;
  top_scorer: PersonBase,
}

export interface IParams {
  currentCup?: number
}

export interface IPlaces {
  first_place: ITeam | null,
  second_place: ITeam | null,
  third_place: ITeam | null,
}

export interface IWinners {
  id: number,
  cup_id: number,
  name: string,
  logo: string,
  place: number,
  captain: string,
}

export interface CupMatch {
  id: number,
  cup_id: number,
  team_one: '',
  team_one_logo: '',
  score: number,
  team_two: '',
  team_two_logo: '',
  date_time: ''
  group: '',
  play_off: null
}

export interface IArchiveState {
  archiveStatus: Status,
  cupReadStatus: Status,
  cupsList: FilterSelectOption[] | null,
  cupsListStatus: Status,
  cupsRead: ICupsRead | null,
  currentCup: FilterSelectOption | null,
  places: IPlaces | null,
  placesStatus: Status,
  archiveError: Error | null,
  cupsListError: Error | null,
  cupReadError: Error | null,
  currentCupError: Error | null,
  winners: IWinners[] | null,
  players: IWinners[] | null,
  matchesCups: [],
  filterSuperCup: FilterSelectOption | null,
  filterSuperCupList: FilterSelectOption[] | null,
  divisionSelect: FilterSelectOption | null,
  divisionFilterList: FilterSelectOption | null,
}
