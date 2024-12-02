import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { HTag } from '@/shared/ui/HTag/HTag';
import { useAppDispatch, useAppSelector } from '@/app/providers/StoreProvider';
import emptyStateTeam from '@/shared/assets/images/emptyStateTeam.jpg';
import emptyStateUser from '@/shared/assets/images/emptyStateUser.jpg';
import { selectCurrentLeague } from '@/entities/CurrentLeague/model/CurrentLeague';
import { IBestPlayers } from '../type/bestPlayersSchema';
import { getPlayers, selectBestPlayers } from '../model/bestPlayersSlice';
import classes from './bestPlayers.module.scss';


const PlayerCard = ({ first_name, position, avatar, team, team_logo, last_name, className }: IBestPlayers) => {
  return (
    <div>
      <div className={`${classes.playerCard} ${className}`}>
        <div
          style={{ backgroundImage: `url("${avatar || emptyStateUser}")` }}
          className={classes.backgroundImage}>
          <div className={classes.playerData}>
            <HTag level={4} myClass={classes.name}>{last_name} {first_name}</HTag>
            <HTag level={5} myClass={classes.position}>{position}</HTag>
          </div>
        </div>
        <div
          style={{ backgroundImage: `url("${team_logo || emptyStateTeam}")` }}
          className={classes.backgroundImage}>
          <div className={classes.playerData}>
            <HTag level={4} myClass={classes.name}>{team}</HTag>
          </div>
        </div>
      </div>
    </div>
  );
};


const BestPlayers = () => {

  const { players } = useAppSelector(selectBestPlayers);
  const { leagueId } = useAppSelector(selectCurrentLeague);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const playersList = players.players && players.players;

  let playerClass = '';

  if (playersList.length <= 2) {
    playerClass = classes.twoCards;
  } else if (playersList.length === 3) {
    playerClass = classes.threeCards;
  } else if (playersList.length >= 4) {
    playerClass = classes.fourCards;
  }
  useEffect(() => {
    dispatch(getPlayers(leagueId));
  }, [ dispatch, leagueId ]);
  return (
    <>
      {playersList.length > 1 && (
        <div>
          <HTag level={3} myClass={classes.title}>{t('topPlayers')}</HTag>
          <HTag level={5} myClass={classes.tourDate}>{t('updateDate')} {players.data_tour}</HTag>
          <div className={classes.players}>
            {playersList &&
              playersList.map((player: IBestPlayers) =>
                <PlayerCard key={player.id} {...player} className={playerClass}/>,
              )}
          </div>
        </div>
      )}
    </>
  );
};


export default BestPlayers;
