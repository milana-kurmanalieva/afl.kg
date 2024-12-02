import { Error, REQUEST_STATUSES } from '@/shared/lib/constants/constants';
import { PersonBase } from '@/shared/ui/Players/PlayerCard/PlayerCard';


export interface RefereeState {
  refereeStatus: REQUEST_STATUSES,
  refereeData: PersonBase[],
  refereeError: Error,
}
