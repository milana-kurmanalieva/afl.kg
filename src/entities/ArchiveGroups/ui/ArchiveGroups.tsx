import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import Tabs, { TabsProps } from 'antd/lib/tabs';
import { useAppDispatch, useAppSelector } from '@/app/providers/StoreProvider';
import { FilterSelectOption, REQUEST_STATUSES } from '@/shared/lib/constants/constants';
import TableTeam from '@/shared/ui/Table/TableTeam';
import FIlterSelect from '@/shared/ui/FIlterSelect/FIlterSelect';
import { Skeleton } from '@/shared/ui/Skeleton/Skeleton';
import MatchesBlock from '@/shared/ui/Matches/MatchesBlock';
import { ArchiveRating } from '@/entities/ArchiveRating';
import { ArchiveBombardier } from '@/entities/ArchiveBombardier';
import { UnCLickableWrapper } from '@/shared/ui/UnClickableWrapper/UnClickableWrapper';
import {
  getGroups, getGroup, getGroupsTeams,
  selectArchiveGroups, getGroupsMatches,
} from '../model/archiveGroupsSlice';
import classes from './ArchiveGroups.module.scss';


interface archiveGroups {
  currentFilter: string | string[] | undefined
}

const ArchiveGroups:FC<archiveGroups> = ({ currentFilter }) => {
  const { t } = useTranslation();

  const tabsLeague: TabsProps['items'] = [
    {
      key: '1',
      label: t('ratingPlayers'),
      children: <ArchiveRating currentFilter={currentFilter} />,
    }, {
      key: '2',
      label: t('ratingBombardiers'),
      children: <ArchiveBombardier currentFilter={currentFilter} />,
    },
  ];

  const dispatch = useAppDispatch();
  const {
    archiveGroupsList,
    archiveCurrentGroup,
    archiveGroupsError,
    archiveGroupsStatus,
    archiveGroupsTeams,
    archiveGroupsMatches,
  } = useAppSelector(selectArchiveGroups);

  const { currentCup, filterSuperCup } = useAppSelector((state) => state.archive);

  const [ currentGroup, setCurrentGroup ] = useState<FilterSelectOption | null>(null);

  const superCupQuery = currentCup?.is_super_cup && filterSuperCup?.id === 1 ? '1' : '2';

  useEffect(() => {
    if (!currentCup?.cup_id || archiveGroupsList?.length) return;
    dispatch(getGroups({ currentCup: currentCup?.cup_id }));
  }, [ currentCup ]);

  useEffect(() => {
    if (!currentGroup) return;
    dispatch(getGroup({ currentGroup: currentGroup.id }));

    const groupLetter = currentGroup.title.slice(-1);

    dispatch(getGroupsTeams({ current_cup: currentCup?.cup_id, group: groupLetter, super_cup: superCupQuery }));
    dispatch(getGroupsMatches({ current_cup: currentCup?.cup_id, group: groupLetter, super_cup: superCupQuery }));
  }, [
    currentGroup,
    filterSuperCup,
    currentCup?.cup_id,
    superCupQuery,
    dispatch,
  ]);

  useEffect(() => {
    if (archiveGroupsList?.length) setCurrentGroup(archiveGroupsList[ 0 ]);
  }, [ archiveGroupsList ]);


  return (
    <>
      <div className={classes.select}>
        {archiveGroupsStatus !== REQUEST_STATUSES.SUCCEEDED || archiveGroupsError ?
          <Skeleton clsName={classes.selectSkeleton} />
          :
          <FIlterSelect
            label={currentGroup ? currentGroup.title : ''}
            changeOption={(option) => setCurrentGroup(option)}
            options={archiveGroupsList}
          />}
      </div>
      {(!archiveGroupsError || archiveGroupsStatus === REQUEST_STATUSES.SUCCEEDED) && (
        <>
          <div className={classes.table}>
            <div className={classes.tableTeam}>
              {/* Передаем данные archiveGroupsTeams в TableTeam */}
              <TableTeam isArchive={true} title='' table={archiveGroupsTeams} />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            <UnCLickableWrapper>
              <MatchesBlock title={t('matches')} matches={archiveGroupsMatches}
                tourList={archiveCurrentGroup.toursList} />
            </UnCLickableWrapper>
            <Tabs defaultActiveKey="1" items={tabsLeague} />
          </div>

        </>
      )}
    </>
  );
};

export default ArchiveGroups;
