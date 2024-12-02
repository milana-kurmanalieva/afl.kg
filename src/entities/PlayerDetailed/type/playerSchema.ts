import { Error, REQUEST_STATUSES } from '@/shared/lib/constants/constants';
import { IPlayerInfo } from '@/shared/ui/PlayerInfoModal/PlayerInfoModal';
import { Statistics } from '@/shared/ui/PlayerInfoModal/PlayerStatistic';


export interface IPlayerState {
  playerDetailed: IPlayerInfo | null;
  playerDetailedStatus: REQUEST_STATUSES;
  playerDetailedError: Error;
  isPlayerModalOpen: boolean;
  playerId: null | number;
  playerStatistics: null | Statistics
}
