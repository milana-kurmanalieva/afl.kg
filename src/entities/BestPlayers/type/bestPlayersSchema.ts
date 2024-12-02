import { Error } from '@/shared/lib/constants/constants';


export interface IBestPlayers {
  id?: number
  first_name: string
  last_name: string
  position: string
  avatar: string
  team: string
  team_logo: string
  className?: string
}


export interface IBestPlayersState {
  players: {
    data_tour: string
    status: string
    playersError: Error
    players: IBestPlayers[]
    length?: number
  }
}
