import { Error, REQUEST_STATUSES, Status } from '@/shared/lib/constants/constants';
import { PersonBase } from '@/shared/ui/Players/PlayerCard/PlayerCard';


export interface OurTeamState {
  ourTeamStatus: REQUEST_STATUSES,
  ourTeamData: PersonBase[],
  ourTeamError: Error,
}

export interface getOurTeamParams {
  id: number
}
