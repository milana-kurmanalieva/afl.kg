import Tabs, { TabsProps } from 'antd/lib/tabs';
import { NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/providers/StoreProvider';
import {
  getCup,
  getCups,
  getWinners,
  setCurrentCupArchive,
  setDivisionFilterList,
  setDivisionSelect,
  setFilterSuerCup,
  setFilterSuerCupList,
} from '@/entities/Archive/model/archiveSlice';
import { ArchiveBombardier } from '@/entities/ArchiveBombardier';
import {
  getArchiveBests,
  getArchiveTable,
  getArchiveTours,
  getChampionShips,
  setCurrentArchiveChampionShip,
  setCurrentArchiveTour,
} from '@/entities/ArchiveChampionship';
import { ArchiveGroups } from '@/entities/ArchiveGroups';
import { ArchiveMatches } from '@/entities/ArchiveMathces';
import { ArchivePlayOff } from '@/entities/ArchivePlayOff';
import { ArchiveRating } from '@/entities/ArchiveRating';
import { BannerRow } from '@/entities/Banners';
import { selectCurrentLeague } from '@/entities/CurrentLeague/model/CurrentLeague';
import {
  getArchivedDivisions,
  selectDivisions,
  setArchivedCurrentDivision,
} from '@/entities/Divisions/model/DivisionSlice';
import { TabsWrapper } from '@/entities/Tabs';
import { Tab } from '@/entities/Tabs/type/TabsSchema';
import { FilterSelectOption, PATHS } from '@/shared/lib/constants/constants';
import { ArchiveBanner } from '@/shared/ui/ArchiveBanner';
import { Container } from '@/shared/ui/Container/Container';
import FIlterSelect from '@/shared/ui/FIlterSelect/FIlterSelect';
import PodiumCard from '@/shared/ui/PodiumCard/PodiumCard';
import { Meta } from '@/shared/ui/seo/Meta';
import TableTeam from '@/shared/ui/Table/TableTeam';
import TopContent from '@/shared/ui/TopContent/TopContent';
import { UnCLickableWrapper } from '@/shared/ui/UnClickableWrapper/UnClickableWrapper';
import { WinnerPlaceCard } from '@/shared/ui/WinnerPlaceCard/WinnerPlaceCard';
import classes from './Archive.module.scss';


const query = 'archive';
export enum FilterTypes {
  LEAGUE = 'league',
  CUP = 'cup',
}

const Archive: NextPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const currentFilter = router.query[ query ];

  const tabs: TabsProps['items'] = [
    {
      key: '1',
      label: t('groupStage'),
      children: <ArchiveGroups currentFilter={currentFilter} />,
    }, {
      key: '2',
      label: t('playoffs'),
      children: <ArchivePlayOff />,
    },
  ];

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
    cupsList,
    cupsRead,
    places,
    currentCup,
    winners,
    filterSuperCup,
    filterSuperCupList,
    divisionSelect,
    divisionFilterList,
  } = useAppSelector((state) => state.archive);

  const { archivedDivisions } = useAppSelector((state) => state.division);

  const { currentLeague, leagueId } = useAppSelector(selectCurrentLeague);

  const {
    archiveBests,
    archiveTable,
    currentArchiveTour,
  } = useAppSelector((state) => state.archiveChampionShip);

  const tabsList: Array<Tab<FilterTypes>> = [
    {
      value: FilterTypes.LEAGUE,
      label: currentLeague.title,
    }, { value: FilterTypes.CUP, label: t('leaguesCup') },
  ];

  const pages = [
    {
      href: '',
      disabled: true,
      page: currentLeague.title,
    }, {
      href: PATHS.archive,
      page: t('archive'),
    },
  ];

  const superCupQuery =
    currentCup?.is_super_cup && filterSuperCup?.id === 1 ? '1' : '2';

  useEffect(() => {
    if (currentFilter === FilterTypes.CUP && currentCup?.cup_id) {
      dispatch(
        getWinners({ currentCup: currentCup.cup_id, super_cup: superCupQuery }),
      );
      dispatch(
        getCup({ currentCup: currentCup?.cup_id, super_cup: superCupQuery }),
      );
    }
  }, [
    currentCup?.cup_id,
    currentCup?.is_super_cup,
    dispatch,
  ]);

  useEffect(() => {
    if (currentFilter === FilterTypes.CUP && leagueId) {
      dispatch(getCups(leagueId)).then(({ payload }) => {
        dispatch(setCurrentCupArchive(payload[ 0 ]));
      });
    }
  }, [
    dispatch,
    currentFilter,
    leagueId,
  ]);

  useEffect(() => {
    if (currentFilter === FilterTypes.LEAGUE && leagueId) {
      dispatch(getArchivedDivisions({ leagueId })).then(({ payload }) => {
        dispatch(setArchivedCurrentDivision(payload[ 0 ]));
      });
    }
  }, [
    dispatch,
    currentFilter,
    leagueId,
  ]);

  useEffect(() => {
    if (leagueId) {
      dispatch(getChampionShips({ leagueId })).then(({ payload }) => {
        dispatch(setCurrentArchiveChampionShip(payload[ 0 ]));
      });
    }
  }, [ dispatch, leagueId ]);

  useEffect(() => {
    if (currentFilter === FilterTypes.LEAGUE) {
      // eslint-disable-next-line no-mixed-operators
      if (divisionFilterList?.id || divisionFilterList?.original_division_id && divisionSelect?.id) {
        dispatch(
          getArchiveTable({
            chamId: divisionSelect?.id,
            divisionId: divisionFilterList?.id ?? divisionFilterList?.original_division_id,
            tourId: currentArchiveTour?.id,
          }),
        );
      }
    }
  }, [
    currentFilter,
    divisionSelect?.id,
    currentArchiveTour?.id,
    dispatch,
    divisionFilterList?.id,
    divisionFilterList?.original_division_id,
  ]);

  useEffect(() => {
    if (divisionSelect) {
      dispatch(getArchiveBests({ chamId: divisionSelect?.id }));
    }
  }, [ divisionSelect, dispatch ]);


  useEffect(() => {
    if (divisionSelect?.id) {
      dispatch(
        getArchiveTours({ championShipId: divisionSelect?.id }),
      ).then(({ payload }) => dispatch(setCurrentArchiveTour(payload[ 0 ])));
    }
  }, [ divisionSelect?.id, dispatch ]);

  const handleChangeFilters = useMemo(
    () => (action: any) => (option: FilterSelectOption) =>
      dispatch(action(option)),
    [ dispatch ],
  );

  useEffect(() => {
    if (!router.query[ query ])
      router.push({
        query: `${query}=${FilterTypes.LEAGUE}`,
        pathname: router.pathname,
      });
  }, [ router ]);

  useEffect(() => {
    if (currentFilter === FilterTypes.CUP) {
      dispatch(
        setFilterSuerCupList(
          // eslint-disable-next-line max-len
          [ { id: 1, title: currentCup?.super_cup_one_name || 'Super Cup 1' }, { id: 2, title: currentCup?.super_cup_two_name || 'Super Cup 2' } ],
        ),
      );
    }
  }, [
    dispatch,
    currentFilter,
    currentCup,
  ]);


  useEffect(() => {
    if (currentCup?.cup_id) {
      dispatch(getWinners({ currentCup: currentCup.cup_id }));
    }
  }, [ currentCup?.cup_id, dispatch ]);

  useEffect(() => {
    if (divisionSelect?.championship_division_archives?.length) {
      dispatch(setDivisionFilterList(divisionSelect?.championship_division_archives[ 0 ]));
    }
  }, [ divisionSelect?.championship_division_archives ]);
  // if (archiveBestsStatus === REQUEST_STATUSES.NOT_REQUESTED ||
  //   archivedDivisionsStatus === REQUEST_STATUSES.NOT_REQUESTED
  // ) return <div className={classes.loader}><EmptyState/></div>;

  useEffect(() => {
    if (filterSuperCupList && filterSuperCupList?.length) {
      dispatch(setFilterSuerCup(filterSuperCupList[ 0 ]));
    }
    if (archivedDivisions?.length) {
      dispatch(setDivisionSelect(archivedDivisions[ 0 ]));
    }
  }, [ filterSuperCupList, archivedDivisions ]);

  const championshipOptions = useMemo(() => {
    return divisionSelect?.championship_division_archives?.map((item) => (
      {
        id: item.original_division_id,
        title: item.title,
      }
    ));
  }, [ divisionSelect?.championship_division_archives ]);

  return (
    <div className={classes.archiveWrapper}>
      <Meta title={t('archive')} description={t('archive') as string}></Meta>
      <Container variant="large">
        <TopContent title={t('archive')} breadcrumbs={pages}>
          <TabsWrapper tabsList={tabsList} query={query} />
        </TopContent>

        {currentFilter === FilterTypes.LEAGUE && (
          <div className={classes.filterArchiveSelect}>
            {divisionSelect?.championship_division_archives?.length && (
              <FIlterSelect
                options={championshipOptions}
                label={divisionFilterList?.title || ''}
                changeOption={handleChangeFilters(setDivisionFilterList)}
              />
            )}
            {(archivedDivisions.length || cupsList?.length) && (
              <FIlterSelect
                options={archivedDivisions}
                label={divisionSelect?.title || ''}
                changeOption={handleChangeFilters(setDivisionSelect)}
              />
            )}
          </div>
        )}
        {currentFilter === FilterTypes.CUP && (
          <div style={{ display: 'flex', gap: '16px' }}>
            <FIlterSelect
              options={cupsList || []}
              changeOption={handleChangeFilters(setCurrentCupArchive)}
              label={currentCup?.title as string}
            />
            {filterSuperCupList && filterSuperCupList?.length && (
              <FIlterSelect
                options={filterSuperCupList}
                changeOption={handleChangeFilters(setFilterSuerCup)}
                label={filterSuperCup?.title ?? ''}
              />
            )}
          </div>
        )}
        <UnCLickableWrapper>
          <ArchiveBanner
            bestBombardier={
              currentFilter === FilterTypes.LEAGUE
                ? archiveBests?.top_scorer
                : cupsRead?.top_scorer
            }
            bestPlayer={
              currentFilter === FilterTypes.LEAGUE
                ? archiveBests?.best_player
                : cupsRead?.best_player
            }
          />
        </UnCLickableWrapper>
        <BannerRow />
        <UnCLickableWrapper>
          {currentFilter === FilterTypes.CUP && (
            <div className={classes.commandRating}>
              {places?.first_place &&
                Object.entries(places).map(([ key, value ]) => (
                  <PodiumCard key={key} variant={key} team={value} />
                ))}
            </div>
          )}
        </UnCLickableWrapper>
        <UnCLickableWrapper>
          <div className={classes.winners}>
            {currentFilter === FilterTypes.CUP &&
              winners &&
              winners.map((item, index) => (
                <WinnerPlaceCard
                  key={item.id}
                  name={item.name}
                  captain={item.captain}
                  place={index + 1}
                  image={item.logo}
                />
              ))}
          </div>
        </UnCLickableWrapper>

        {currentFilter === FilterTypes.LEAGUE && (
          <ArchiveMatches variant={currentFilter} />
        )}
        {currentFilter === FilterTypes.LEAGUE && (
          <TableTeam
            table={archiveTable}
            title={'Турнирная таблица'}
            isArchive={true}
          />
        )}
        <div className={classes.filters}>
          <Tabs
            defaultActiveKey="1"
            items={currentFilter === FilterTypes.LEAGUE ? tabsLeague : tabs}
          />
        </div>
      </Container>
    </div>
  );
};

export default Archive;
