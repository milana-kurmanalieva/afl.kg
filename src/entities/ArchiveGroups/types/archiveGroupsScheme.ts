import { FilterSelectOption, Status, ITbaleTeam } from '@/shared/lib/constants/constants';
import { MatchesType } from '@/shared/ui/Matches/MatchFinall';


export interface IParamsGroups {
  currentGroup?: number,
  currentCup?: number,
}


export interface ICurrentGroup {
  teams_data: ITbaleTeam[],
  matches_list: MatchesType[],
  toursList: Array<FilterSelectOption>;
}

export interface IArchiveGroups {
  archiveGroupsStatus: Status,
  archiveGroupsList: FilterSelectOption[],
  archiveCurrentGroup: ICurrentGroup,
  archiveGroupsError: Error | null,
  archiveGroupsTeams: [],
  archiveGroupsMatches: [],
  archiveGroupsRatings: [],
  archiveGroupsBombardiers: []
}
