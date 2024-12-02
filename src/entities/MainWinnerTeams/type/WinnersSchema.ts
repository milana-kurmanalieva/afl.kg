import { FilterSelectOption } from '@/shared/lib/constants/constants';


interface IData {
  original_division_id: number,
  name: string,
}

interface IWinnersCard {
  id: number
  championship: number
  games: number
  wins_count: number
  division: number
  draws: number
  defeats: number
  goals: number
  conceded: number
  points: number
  logo: string
  name: string
}

export interface IParams {
  leagueId: number
  divisionId : number
}

export interface IWinners {
  data?: IData[]
  divisionSelect?: FilterSelectOption | null
  status?: string
  winnerTeams: IWinnersCard[]
}
