import React, { FC, useEffect, useMemo } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import FIlterSelect from '@/shared/ui/FIlterSelect/FIlterSelect';
import { useAppDispatch, useAppSelector } from '@/app/providers/StoreProvider';
import { selectCurrentLeague } from '@/entities/CurrentLeague/model/CurrentLeague';
import { PATHS, REQUEST_STATUSES } from '@/shared/lib/constants/constants';
import { Skeleton } from '@/shared/ui/Skeleton/Skeleton';
import TableTeam from '@/shared/ui/Table/TableTeam';
import MatchesBlock from '@/shared/ui/Matches/MatchesBlock';
import Loader from '@/shared/ui/loader/Loader';
import useIsMobile from '@/shared/lib/hooks/useIsMobile';
import { HTag } from '@/shared/ui/HTag/HTag';
import { BannerRow } from '@/entities/Banners';
import { getCurrentCupGroups, getSuperCupGroupData, selectCurrentCup, setCurrentGroup } from '../model/currentCupSlice';
import classes from './currentCup.module.scss';


interface IGroups {
  isMain?: boolean;
  superCupId: number;
}

export const Groups: FC<IGroups> = ({ isMain = false, superCupId }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const router = useRouter();

  const { leagueId } = useAppSelector(selectCurrentLeague);
  const {
    currentCup,
    currentCupGroups,
    currentCupGroupsStatus,
    currentCupGroupsError,
    currentGroup,
    groupCupData,
    groupCupDataStatus,
    groupCupDataError,
  } = useAppSelector(selectCurrentCup);
  const isHomePage = useMemo(() => {
    return router.pathname === PATHS.home;
  }, [ router ]);

  useEffect(() => {
    dispatch(getCurrentCupGroups({ leagueId }));
  }, [ leagueId ]);

  useEffect(() => {
    if (currentCupGroups?.length) dispatch(setCurrentGroup(currentCupGroups[ 0 ]));
  }, [ currentCupGroups.length ]);

  useEffect(() => {
    if (currentGroup) dispatch(getSuperCupGroupData(
      {
        groupId: currentGroup.id,
        superCupId: superCupId,
        isSuperCup: currentCup?.is_super_cup ? true : false,
      }));
  }, [
    currentGroup,
    superCupId,
    currentCup?.is_super_cup,
    dispatch,
  ]);

  if (!currentCup) return <></>;

  return (
    <>
      <div className={classes.select}>
        {isMain && <HTag level={2}>{currentCup?.title}</HTag>}
        {currentCupGroupsStatus !== REQUEST_STATUSES.SUCCEEDED || currentCupGroupsError ?
          <Skeleton clsName={classes.selectSkeleton} />
          :
          <FIlterSelect
            label={currentGroup?.title ?? ''}
            changeOption={(option) => dispatch(setCurrentGroup(option))}
            options={currentCupGroups.map(group => ({ ...group, title: `${group.title}` }))}
          />}
      </div>

      {(!groupCupDataError || groupCupDataStatus === REQUEST_STATUSES.SUCCEEDED) ? (
        <>
          {!isMain && <div className={classes.table}>
            <TableTeam title={(isMobile ? t('leaderboard') : '') ?? ''} table={groupCupData.teams_data} />
          </div>}
          {!isMain && !isHomePage && <BannerRow />}
          <MatchesBlock title={t('matches')} matches={groupCupData.matches_list} tourList={[]} />
        </>
      ) : <div className={classes.loader}><Loader /></div>}
    </>
  );
};
