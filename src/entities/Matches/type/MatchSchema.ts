import { REQUEST_STATUSES, Error, TeamMatch } from '@/shared/lib/constants/constants';
import { MatchesType } from '@/shared/ui/Matches/MatchFinall';
import { PersonBase } from '@/shared/ui/Players/PlayerCard/PlayerCard';


export interface IPhotoAlbum {
  id: number
  title: string
  data: string
  cover: string
}

export interface IVideoAlbum {
  id: number
  title: string
  is_live: boolean
  date: string
  url: string
}


export interface MatchesState {
  matchData: MatchInfo[];
  matchStatus: REQUEST_STATUSES
  matchError: Error

  cupData: CupInfo[]
  cupStatus: REQUEST_STATUSES
  cupError: Error

  matchesAdditional: MatchesType[]
  matchesError: Error

  photoAlbums: IPhotoAlbum[]
  photoError: Error
  videoAlbums: IVideoAlbum[]
  videoError: Error
}

export interface MatchInfo {
  id: number
  best_player: Best_Info
  team_one: TeamMatch
  team_one_logo: string
  team_two: TeamMatch
  team_two_logo: string
  score: string
  status?: string
  date_time: string
  judge: number | string
  beat_player: number
  location: string
  tour?: Tour | string;
  tm_one_players: TeamElement[]
  tm_two_players: TeamElement[];
  alt_result?: string;
  description?: string;
  disqualificated_players: PersonBase[]
  date?: string
  result?: string
  division?: string
}

export interface CupInfo {
  id: number
  best_player: Best_Info
  team_one: TeamMatch
  team_one_logo: string
  team_two: TeamMatch
  team_two_logo: string
  score: string
  status?: string
  judge: number | string
  date: string
  location: string
  tm_one_players: TeamElement[]
  tm_two_players: TeamElement[]
  result?: string
  tour?: Tour | string
  division?: string
}

export interface Best_Info {
  avatar: string
  birth_date: string
  citizenship: string
  first_name: string
  id: number
  last_name: string
  team: string
  team_logo: string
}


export interface Team {
  id: number
  name: string
  logo: string
  captain: string
  division: number
}

export interface Tour {
  id: number
  number: string
  date: string
}

export interface TeamElement {
  elements_list: Elem[]
  player: string
}

export interface Elem {
  element: string
}
