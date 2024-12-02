import { Error, FilterSelectOption, REQUEST_STATUSES } from '@/shared/lib/constants/constants';
import { PersonBase } from '@/shared/ui/Players/PlayerCard/PlayerCard';


export interface IInitialState {
  teamStatus: REQUEST_STATUSES,
  teamData: ITeam,
  teamError: Error,

  teamPlayersData: PersonBase[],
  teamPlayersStatus: REQUEST_STATUSES,
  teamPlayersError: Error,

  archiveTeamPlayersData: PersonBase[],
  archiveTeamPlayersStatus: REQUEST_STATUSES,
  archiveTeamPlayersError: Error,

  teamMatchesData: [],
  teamMatchesStatus: REQUEST_STATUSES,
  teamMatchesError: Error,

  teamNewsData: [],
  teamNewsStatus: REQUEST_STATUSES,
  teamNewsError: Error,

  teamRating: [],
  teamRatingError: Error,
  teamRatingStatus: REQUEST_STATUSES,
}

export type ITeam = ITeamData | null
export interface ITeamData {
  id: number
  name: string
  logo: string
  year_of_found: number
  president: string
  trainer: string
  captain: string
  link: string
  division: Division
  tag: Tag
  achievements: Achievement[]
  sponsors: ISponsor[]
}

export interface Division {
  id: number
  name: string
}

export interface Tag {
  id: number
  title: string
}

export interface Achievement {
  title: string
}

export interface ISponsor {
  name: string
  logo: string
  link: string
}

export interface IParams {
  id: string | null
  champId: string | string[] | undefined
}
