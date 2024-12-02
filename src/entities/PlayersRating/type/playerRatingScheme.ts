import { ITbalePlayer, REQUEST_STATUSES, Status } from '@/shared/lib/constants/constants';


export interface IParamsRating {
  divisionId: number
}


export interface IPlayersRating {
  playersRating: ITbalePlayer[],
  playersRatingError: Error | null,
  playersRatingStatus: Status,

  cupPlayersRating: ITbalePlayer[],
  cupPlayersRatingStatus: REQUEST_STATUSES
}
