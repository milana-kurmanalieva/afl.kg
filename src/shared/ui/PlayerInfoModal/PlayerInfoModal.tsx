import React, { CSSProperties, FC, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { useTranslation } from 'next-i18next';
import { useOutsideClick } from '@/shared/lib/hooks/useOutsideClick';
import bgPlayer from '@/images/playerBg.png';
import closeIcon from '@/icons/close.svg';
import { useAppDispatch, useAppSelector } from '@/app/providers/StoreProvider';
import {
  getArchiveStatistics,
  selectPlayerDetailed,
  setPlayerId, togglePlayerModal,
} from '@/entities/PlayerDetailed/model/playerDetailsSlice';
import { FilterSelectOption } from '@/shared/lib/constants/constants';
import FIlterSelect from '../FIlterSelect/FIlterSelect';
import classes from './modal.module.scss';
import { PlayerStats } from './PlayerStats';
import { PlayerStatistic } from './PlayerStatistic';


const imageStyle: CSSProperties = {
  width: '100%',
  height: '150px',
  objectFit: 'cover',
};

export interface IPlayerInfo {
  id: number;
  first_name: string;
  last_name: string;
  avatar: string;
  number: number;
  position: number;
  citizenship: string;
  birth_date: string;
  team_name: string;
  team_id: string;
  transfer_status: string;
  goals: number;
  assists: number;
  yel_cards: number;
  red_cards: number;
  weight: number;
  height: number;
  games: number;
  rating: number;
  division_name: string | null;
}

interface IPlayerInfoModal {
  player: IPlayerInfo;
}

export const PlayerInfoModal: FC<IPlayerInfoModal> = ({ player }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const { isPlayerModalOpen } = useSelector(selectPlayerDetailed);
  const [ isMounted, setIsMounted ] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);

  const currentChampDefault = useMemo(() => {
    return { title: t('currentSeasonStatistics'), id: -1 };
  }, []);

  const { championshipsList } = useAppSelector(state => state.archiveChampionShip);
  const { playerStatistics } = useAppSelector(selectPlayerDetailed);
  const [ currentChamp, setCurrentChamp ] = useState(currentChampDefault);

  const closeModal = () => {
    dispatch(togglePlayerModal(false));
    dispatch(setPlayerId(null));
    document.body.style.overflow = 'auto';
  };

  const handleChangeChamp = (champ: FilterSelectOption) => {
    setCurrentChamp(champ);
    if (champ.id !== -1) dispatch(getArchiveStatistics({ playerId: player.id, champId: champ.id }));
  };

  useOutsideClick<HTMLDivElement | null>(modalRef, closeModal, isPlayerModalOpen);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    createPortal(
      <>
        {isPlayerModalOpen && (
          <div className={`${classes.modal} ${isPlayerModalOpen ? classes.modalActive : ''}`} />
        )}
        <AnimatePresence>
          {isPlayerModalOpen && (
            <motion.div
              ref={modalRef}
              className={classes.content}
              initial={{ translateX: 300, opacity: 0 }}
              animate={{ translateX: 0, opacity: 1 }}
              exit={{ translateX: 300, opacity: 0 }}
              transition={{ duration: .5, type: 'tween' }}
            >
              <div className={classes.playerBg}>
                <Image
                  src={bgPlayer}
                  alt="player background"
                  style={imageStyle}
                />
                <Image
                  className={classes.closeIcon}
                  src={closeIcon}
                  alt='close'
                  width={24}
                  height={24}
                  onClick={closeModal}
                />
              </div>
              <div className={classes.summary}>
                <div className={classes.avatar}>
                  <img
                    className={classes.avatarImage}
                    src={player.avatar}
                    alt='avatar'
                  />
                  <h4 className={classes.name}>{player.last_name} {player.first_name}</h4>
                </div>

                <PlayerStats player={player} />
                {currentChamp && <div className={classes.select}>
                  <FIlterSelect
                    options={championshipsList.concat(currentChampDefault)}
                    changeOption={(option) => handleChangeChamp(option)}
                    label={currentChamp.title}
                  />
                </div>}
                <PlayerStatistic stats={currentChamp.id === -1 ? player : (playerStatistics ?? player)} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </>,
      document.body,
    )
  );
};
