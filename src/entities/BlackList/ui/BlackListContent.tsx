import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/app/providers/StoreProvider';
import { getBlackListPlayers, getBlackListTeam, selectBlackList } from '../model/BlackListSlice';
import { BlackListTypeProps } from '../types/BlackListScheme';
import classes from './blackListContent.module.scss';
import { BlackListTable } from './BlackListTable';


type BlackListContentProps = { blackListId: number }

export const BlackListContent:FC<BlackListContentProps> = ({ blackListId }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { blackListTeamData, blackListPlayersData } = useAppSelector(selectBlackList);

  useEffect(() => {
    dispatch(getBlackListTeam({ blackListId }));
    dispatch(getBlackListPlayers({ blackListId }));
  }, [ blackListId ]);

  const teamData = blackListTeamData ?? { results: [] as BlackListTypeProps[] };
  const playersData = blackListPlayersData ?? { results: [] as BlackListTypeProps[] };

  return (
    <div className={classes.wrapper}>
      <BlackListTable title={t('teams')} data={teamData.results} />
      <BlackListTable title={t('players')} data={playersData.results} />
    </div>
  );
};
