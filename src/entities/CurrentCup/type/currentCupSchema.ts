import {
  Error,
  FilterSelectOption,
  ITbaleTeam,
  REQUEST_STATUSES,
  ISuperCupResponse,
} from '@/shared/lib/constants/constants';
import { MatchesType } from '@/shared/ui/Matches/MatchFinall';
import { IPlayerInfo } from '@/shared/ui/PlayerInfoModal/PlayerInfoModal';


export interface CupDescription {
  id: number,
  title: string,
  image: null | string,
  description: string;
  year: number,
  season: string,
  start_date: string,
  end_date: string,
  best_player: null | IPlayerInfo,
  best_bombardir: null | IPlayerInfo,
  is_super_cup?: boolean | null
}

export interface CurrentCupState {
  currentCup: null | CupDescription;
  currentCupError: Error;
  currentCupStatus: REQUEST_STATUSES;

  cup_now: null;

  currentCupGroups: FilterSelectOption[];
  currentCupGroupsError: Error;
  currentCupGroupsStatus: REQUEST_STATUSES;

  currentGroup: FilterSelectOption | null;

  currentCupStages: FilterSelectOption[];
  currentCupStagesStatus: REQUEST_STATUSES;
  currentCupStagesError: Error;
  currentStage: FilterSelectOption | null

  superCupData: ISuperCupResponse | null;
  superCupDataStatus: REQUEST_STATUSES;
  superCupDataError: Error;

  groupCupData: {
    id?: number;
    title?: string;
    teams_data: ITbaleTeam[];
    matches_list: Array<MatchesType>;
    super_cup?: string;
  };
  groupCupDataStatus: REQUEST_STATUSES;
  groupCupDataError: Error;

  stageCupData: {
    matches_list: Array<MatchesType>
  };
  stageCupDataStatus: REQUEST_STATUSES;
  stageCupDataError: Error;
}

export interface IParams {
  leagueId: number;
}

export interface ITableParams {
  groupId: number;
}

export interface IStageParams {
  stageId: number;
}
