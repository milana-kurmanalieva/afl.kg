import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { HTag } from '@/shared/ui/HTag/HTag';
import { getTeamPlayers, selectTeam } from '@/entities/Team/model/teamSlice';
import { useAppDispatch } from '@/app/providers/StoreProvider';
import { Modal } from '@/shared/ui/Modal/Modal';
import { PlayersList } from '@/shared/ui/Players/PlayersList/PlayersList';
import { useInnerWidthExceedsDefault } from '@/shared/lib/hooks/useInnerWidthExceedsDefault';
import { BlackListTableProps } from '../types/BlackListScheme';
import classes from './blackListContent.module.scss';
import { BlackListTableMobile } from './BlackListTableMobile';


export const BlackListTable: FC<BlackListTableProps> = ({ title, data }) => {
  const dispatch = useAppDispatch();
  const { teamPlayersData } = useSelector(selectTeam);
  const [ isOpen, setIsOpen ] = useState<boolean>(false);
  const isMobile = useInnerWidthExceedsDefault();
  const { t } = useTranslation();
  if (!data || data.length === 0) return <></>;

  const handleGetPlayers = (id: number) => {
    dispatch(getTeamPlayers(id));
    setIsOpen(true);
  };

  return (
    <div className={classes.blackList}>
      <HTag level={4}>
        {title}
      </HTag>
      {isMobile ? (
        <BlackListTableMobile
          results={data}
          handleGetPlayers={handleGetPlayers}
          teamName={t('team')}
          playerName={t('playerName')}
          reason={t('reason')}
          period={t('period')}
        />
      ) : (
        <table className={classes.blackListTable}>
          <thead className={classes.blackListThead}>
            <tr>
              {data[ 0 ]?.player_name && (
                <th>{t('playerName')}</th>
              )}
              <th>{t('team')}</th>
              <th>{t('reason')}</th>
              <th>{t('period')}</th>
            </tr>
          </thead>
          <tbody className={classes.blackListTbody}>
            {data?.map((item) => (
              <tr key={item.period_end}>
                {item.player_name && (
                  <td>{item.player_name}</td>
                )}
                <td>
                  {item.player_name ? (
                    item.team_name
                  ) : (
                    <button
                      onClick={() => handleGetPlayers(item.team)}
                      className={classes.blackListButton}
                    >
                      {item.team_name}
                    </button>
                  )}
                </td>
                <td>{item.reason}</td>
                <td>{item.period_start} - {item.period_end}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Modal
        isOpen={isOpen}
        setIsOpen={() => setIsOpen(false)}
        title={t('commandStructure')}
        className={classes.modal}
      >
        <div className={classes.modalWrapper}>
          <PlayersList isAbleToOpenCard={false} players={teamPlayersData}/>
        </div>
      </Modal>
    </div>
  );
};
