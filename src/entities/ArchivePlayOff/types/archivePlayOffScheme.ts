import { Error, FilterSelectOption, IMatchesItem, Status } from '@/shared/lib/constants/constants';
import { MatchesType } from '@/shared/ui/Matches/MatchFinall';


export interface IParamsStages {
  currentCup?: number,
  currentStage?: number
}

export interface IArchiveStage {
  archiveStagesStatus: Status,
  archiveStages: FilterSelectOption[],
  archiveStage: {
    matches_list: MatchesType[],
  },
  archiveStateError: Error,
}
