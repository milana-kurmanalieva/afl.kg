import { Error, ITbalePlayer, REQUEST_STATUSES } from '@/shared/lib/constants/constants';


export interface IBombardier {
  id: number,
  first_name: string,
  last_name: string,
  team: string,
  goals: number
}
export interface IBombardierParams {
  divisionId: number;
}

export interface IBombardierState {
  bombardier: ITbalePlayer[],
  bombardierError: Error,
  bombardierStatus: REQUEST_STATUSES,

  cupBombardiers: ITbalePlayer[],
  cupBombardiersStatus: REQUEST_STATUSES,

  superCupBombardiers: ITbalePlayer[],
  superCupBombardiersError: Error,
  superCupBombardiersStatus: REQUEST_STATUSES
}
