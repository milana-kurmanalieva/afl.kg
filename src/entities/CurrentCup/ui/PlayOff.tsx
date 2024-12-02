import React, { FC, useEffect, useMemo } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import FIlterSelect from '@/shared/ui/FIlterSelect/FIlterSelect';
import { useAppDispatch, useAppSelector } from '@/app/providers/StoreProvider';
import { FilterSelectOption, PATHS, REQUEST_STATUSES } from '@/shared/lib/constants/constants';
import MatchesBlock from '@/shared/ui/Matches/MatchesBlock';
import Loader from '@/shared/ui/loader/Loader';
import { BannerRow } from '@/entities/Banners';
import { MatchDetail } from '@/shared/ui/Matches/MatchDetail';
import { EmptyState } from '@/shared/ui/EmptyState/EmptyState';
import { getSuperCupStageData, selectCurrentCup, setCurrentStage } from '../model/currentCupSlice';
import classes from './currentCup.module.scss';


const PlayOff: FC<{ superCupId: number, activeKey?: string }> = ({ superCupId, activeKey }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { currentCupStages, stageCupDataStatus, stageCupData, currentStage } = useAppSelector(selectCurrentCup);
  const { currentCup } = useAppSelector(selectCurrentCup);

  const isHomePage = useMemo(() => {
    return router.pathname === PATHS.home;
  }, [ router ]);

  const handleChangeOptions = (newStage: FilterSelectOption): void | null => {
    dispatch(setCurrentStage(newStage));
  };

  useEffect(() => {
    if (currentCupStages.length && !currentStage) {
      dispatch(setCurrentStage(currentCupStages[ currentCupStages.length - 1 ]));
    }
  }, [
    currentCupStages,
    currentStage,
    dispatch,
  ]);

  useEffect(() => {
    if (currentStage) dispatch(getSuperCupStageData(
      {
        stageId: currentStage.id ?? currentCupStages[ currentCupStages.length - 1 ].id,
        superCupId: superCupId,
        isSuperCup: currentCup?.is_super_cup ? true : false,
      }));
  }, [
    currentStage,
    superCupId,
    currentCup?.is_super_cup,
    dispatch,
    currentCupStages,
  ]);

  return (
    <>
      <div className={classes.select}>
        {!currentCupStages ?
          <></>
          :
          <FIlterSelect
            label={currentStage?.title ?? currentCupStages[ currentCupStages.length - 1 ].title}
            changeOption={handleChangeOptions}
            options={currentCupStages}
          />
        }
      </div>

      {stageCupDataStatus === REQUEST_STATUSES.SUCCEEDED ? (
        <div className={classes.matches}>
          <MatchesBlock
            title={t('matches')}
            matches={stageCupData.matches_list}
            tourList={[]}
            activeKey={activeKey}
          />
          {stageCupData.matches_list.length === 1 && (
            <MatchDetail match={stageCupData.matches_list[ 0 ]} />
          )}
        </div>
      ) : (
        <>
          {stageCupDataStatus === REQUEST_STATUSES.NOT_REQUESTED ? (
            <EmptyState />
          ) : (
            <div className={classes.loader}><Loader /></div>
          )}
        </>
      )}

      {!isHomePage && <BannerRow />}
    </>
  );
};

export default PlayOff;
