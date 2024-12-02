import { ICupsRead } from '@/entities/Archive/type/arciveSliceScheme';
import { FilterSelectOption, IMatchesItem, ITbalePlayer, ITbaleTeam, Status } from '@/shared/lib/constants/constants';
import { MatchesType } from '@/shared/ui/Matches/MatchFinall';


export interface IChampionShip {
  championshipsStatus: Status,
  championshipsList: FilterSelectOption[],
  tourList: FilterSelectOption[],
  archiveTable: ITbaleTeam[],
  archiveBests: ICupsRead | null,
  matches: MatchesType[],
  bombardiers: ITbalePlayer[],
  rating: ITbalePlayer[],
  championshipError: Error | null,
  currentArchiveTour: FilterSelectOption | null,
  currentArchiveChampionShip: FilterSelectOption | null,
  championshipsListStatus: Status,
  championshipsListError: Error | null,
  tourListStatus: Status,
  tourListStatusError: Error | null,
  archiveTableStatus: Status,
  archiveTableError: Error | null,
  archiveBestsStatus: Status,
  archiveBestsError: Error | null,
  matchesStatus: Status,
  matchesError: Error | null,
  bombardiersStatus: Status,
  bombardiersError: Error | null,
  ratingStatus: Status,
  ratingError: Error | null,

}

export interface IParams {
  leagueId?: number,
  championShipId?: number,
  chamId?: number,
  divisionId?: number,
  tourId?: number,
}
