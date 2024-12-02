import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useAppDispatch, useAppSelector } from '@/app/providers/StoreProvider';
import { selectDivisions } from '@/entities/Divisions/model/DivisionSlice';
// eslint-disable-next-line import/named
import TableTeam from '@/shared/ui/Table/TableTeam';
import { selectLeagueNews } from '@/entities/News/model/LeagueNewsSlice';
import { NewsSideWidget } from '@/shared/ui/News/NewsSideWidget/NewsSideWidget';
import { BottomShowMore } from '@/shared/ui/BottomShowMore/BottomShowMore';
import { FilterSelectOption, PATHS } from '@/shared/lib/constants/constants';
import useIsMobile from '@/shared/lib/hooks/useIsMobile';
import {
  selectCurrentCup,
  setCurrentGroup,
} from '@/entities/CurrentCup/model/currentCupSlice';
import { selectCurrentLeague } from '@/entities/CurrentLeague/model/CurrentLeague';
import FootballFieldsCard from '@/shared/ui/FootballFieldsCard/FootballFieldsCard';
import SportShopsCard from '@/shared/ui/SportShopsCard/SportShopsCard';
import League from '@/shared/ui/League/League';
import classes from './info.module.scss';


const InfoNews = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const dispatch = useAppDispatch();

  const { divisionTable, divisionTableStatus, divisions } = useAppSelector(selectDivisions);
  const { leagueNews } = useAppSelector(selectLeagueNews);
  const { leagues } = useAppSelector(selectCurrentLeague);
  const {
    currentCupGroups,
    groupCupDataStatus,
    cup_now,
  } = useAppSelector(selectCurrentCup);


  const navigate = (route: string) => {
    router.push(route);
  };

  const handleChangeFilter = (option: FilterSelectOption) => {
    dispatch(setCurrentGroup(option));
  };


  useEffect(() => {
    if (!currentCupGroups?.length) dispatch(setCurrentGroup(currentCupGroups[ 0 ]));
  }, [ currentCupGroups.length ]);


  return (
    <div className={classes.info}>
      <League leagues={leagues}/>
      <TableTeam
        filterOptions={divisions.map(group => ({ ...group, title: `${group.title}` }))}
        onFilterChange={cup_now ? handleChangeFilter : undefined}
        isSelectFilter
        title={(isMobile ? t('tournamentTable') : '') ?? ''}
        isSmall
        headerLink={cup_now ? PATHS.cup : PATHS.divisions}
        table={divisionTable}
        keys={
          [ { label: 'И', key: 'games' }, { label: 'О', key: 'points' } ]
        }
        status={cup_now ? groupCupDataStatus : divisionTableStatus}
        showMore={() => router.push(cup_now ? PATHS.cup : PATHS.divisions)}
        showingInMainPage={true}
        isHomePage
      />
      <div className={classes.globalNews}>
        {
          isMobile &&
          <div className={classes.cards}>
            <FootballFieldsCard/>
            <SportShopsCard/>
          </div>
        }
        <NewsSideWidget list={leagueNews.results.slice(0, 1)}/>
        <div className={classes.showAllNews}>
          <BottomShowMore handleNext={() => navigate(PATHS.news)}>{t('seeAll')}</BottomShowMore>
        </div>
      </div>
    </div>
  );
};

export default InfoNews;
