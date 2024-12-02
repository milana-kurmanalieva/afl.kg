import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { PlayerInfoModal } from '@/shared/ui/PlayerInfoModal/PlayerInfoModal';
import { useAppDispatch, useAppSelector } from '@/app/providers/StoreProvider';
import { getChampionShips } from '@/entities/ArchiveChampionship';
import { selectCurrentLeague } from '@/entities/CurrentLeague/model/CurrentLeague';
import {
  getPlayerDetailed,
  selectPlayerDetailed,
  setPlayerId,
  togglePlayerModal,
} from '../model/playerDetailsSlice';
import { IPlayerState } from '../type/playerSchema';


const PlayerDetailed = () => {
  const dispatch = useAppDispatch();
  const { playerDetailed, playerId }: IPlayerState = useSelector(selectPlayerDetailed);
  const { leagueId } = useAppSelector(selectCurrentLeague);

  const handleOpenModal = async () => {
    if (!playerId) return;

    const res = await dispatch(getPlayerDetailed({ id: playerId }));
    if (res.meta.requestStatus === 'rejected') return;

    document.body.style.overflow = 'hidden';
    dispatch(togglePlayerModal(true));
  };

  useEffect(() => {
    handleOpenModal();
    dispatch(getChampionShips({ leagueId }));
    if (playerId) {
      dispatch(setPlayerId(playerId));
    } else {
      dispatch(togglePlayerModal(false));
      document.body.style.overflow = 'auto';
    }
  }, [ playerId ]);

  if (!playerDetailed) return null;

  return (
    <PlayerInfoModal player={playerDetailed} />
  );
};

export default PlayerDetailed;
