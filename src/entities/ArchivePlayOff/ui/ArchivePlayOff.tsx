import React, { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import FIlterSelect from '@/shared/ui/FIlterSelect/FIlterSelect';
import { useAppDispatch, useAppSelector } from '@/app/providers/StoreProvider';
import { FilterSelectOption, REQUEST_STATUSES } from '@/shared/lib/constants/constants';
import MatchesBlock from '@/shared/ui/Matches/MatchesBlock';
import { Skeleton } from '@/shared/ui/Skeleton/Skeleton';
import { getGroupsMatches, selectArchiveGroups } from '@/entities/ArchiveGroups/model/archiveGroupsSlice';
import { UnCLickableWrapper } from '@/shared/ui/UnClickableWrapper/UnClickableWrapper';
import { getStages, getStage } from '../model/archivePlayOffSlice';
import classes from './ArchivePlayOff.module.scss';


const ArchivePlayOff = () => {

  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const {
    archiveStages,
    archiveStage,
    archiveStagesStatus,
    archiveStateError,
  } = useAppSelector((state) => state.archiveStages);

  const { archiveGroupsMatches } = useAppSelector(selectArchiveGroups);

  const { currentCup, filterSuperCup } = useAppSelector((state) => state.archive);
  const [ currentStage, setCurrentStage ] = useState<FilterSelectOption>();

  const superCupQuery = currentCup?.is_super_cup && filterSuperCup?.id === 1 ? '1' : '2';
  useEffect(() => {
    if (archiveStages?.length) setCurrentStage(archiveStages[ 0 ]);
    if (currentCup?.cup_id) dispatch(getStages({ currentCup: currentCup.cup_id }));
  }, [ currentCup?.cup_id, archiveStages?.length ]);

  useEffect(() => {
    if (currentCup) {
      dispatch(getGroupsMatches({
        current_cup: currentCup.cup_id,
        group: currentStage?.id,
        super_cup: superCupQuery,
        ...({ play_off: 1 }),
      }));
    }
  }, [ currentCup, currentStage?.id ]);

  useEffect(() => {
    if (currentStage?.id) {
      dispatch(getStage({ currentStage: currentStage.id }));
    }
  }, [ currentStage?.id ]);


  return <>
    <div className={classes.select}>
      {archiveStagesStatus !== REQUEST_STATUSES.SUCCEEDED || archiveStateError ?
        <Skeleton clsName={classes.selectSkeleton}/>
        :
        <FIlterSelect
          label={currentStage?.title as string}
          changeOption={(option) => setCurrentStage(option)}
          options={archiveStages}
        />}
    </div>
    <UnCLickableWrapper>
      <div className={classes.tableTeam}>
        {((!archiveStateError || archiveStagesStatus === REQUEST_STATUSES.SUCCEEDED) && (
          <MatchesBlock title={t('matches')} matches={archiveGroupsMatches} tourList={[]}/>
        ))}
      </div>
    </UnCLickableWrapper>

  </>;
};

export default ArchivePlayOff;
