import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'next-i18next';
import { useAppDispatch } from '@/app/providers/StoreProvider';
import { selectChampionship } from '@/entities/Championship/model/ChampionShipSlice';
import TableTeam from '@/shared/ui/Table/TableTeam';
import MatchesBlock from '@/shared/ui/Matches/MatchesBlock';
import useIsMobile from '@/shared/lib/hooks/useIsMobile';
import { MatchesType } from '@/shared/ui/Matches/MatchFinall';
import { BannerRow } from '@/entities/Banners';
import { TableInfo } from '@/shared/ui/TableInfo/TableInfo';
import { PlayersList } from '@/shared/ui/Players/PlayersList/PlayersList';
import MedalsInfo from '@/shared/ui/MedalsInfo/MedalsInfo';
import { getDivisionMatches, getDivisionTable, getTourBest, selectDivisions } from '../model/DivisionSlice';
import classes from './division.module.scss';


const designationItems = [
  { translateKey: 'game' },
  { translateKey: 'win' },
  { translateKey: 'defeat' },
  { translateKey: 'draw' },
  { translateKey: 'result' },
  { translateKey: 'point' },
];

const DivisionTable = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { currentDivision, divisionMatches, divisionTable, bestTourPlayers } = useSelector(selectDivisions);
  const { currentTour } = useSelector(selectChampionship);

  const isMobile = useIsMobile();

  const limit = useMemo<number>(() => {
    return divisionMatches.length || 10;
  }, [ divisionMatches ]);

  const [ hasNext, setHasNext ] = useState<boolean>(true);
  const [ matchList, setMatchList ] = useState<Array<MatchesType>>([]);

  // pagination for mobile, only 8 items which slices by 0,4 and 4,8 (hardcode, but so conceived)
  const handlePaginate = () => {
    if (hasNext) {
      setMatchList(divisionMatches.slice(limit / 2, limit));
    } else setMatchList(divisionMatches.slice(0, limit / 2));

    setHasNext(prev => !prev);
  };

  const getData = () => {
    if (!currentTour || !currentDivision?.id) return;

    const params = {
      tour_id: currentTour.id,
      division_id: currentDivision?.id,
    };
    dispatch(getDivisionMatches(params));
    dispatch(getDivisionTable(params));
    dispatch(getTourBest({ divisions: [ currentDivision ] }));
  };

  useEffect(() => {
    getData();
  }, [ currentTour, currentDivision ]);


  useEffect(() => {
    setMatchList(isMobile ? divisionMatches.slice(0, limit / 2) : divisionMatches);
  }, [ divisionMatches, isMobile ]);

  return (
    <>
      <MatchesBlock
        tourList={[]}
        title={currentDivision?.title}
        matches={matchList}
        handlePaginate={handlePaginate}
        hasNext={hasNext}
        pagination={isMobile}
      />
      <BannerRow/>

      {!!bestTourPlayers.length && (
        <div className={classes.banner}>
          <div>
            <p className={classes.title}>{t('bestTourPlayers')}</p>
            <PlayersList isAbleToOpenCard players={bestTourPlayers}/>
          </div>
        </div>
      )}


      <TableTeam
        table={divisionTable}
        title={(isMobile ? t('leaderboard') : '') ?? ''}
      />

      <TableInfo
        title={t('designationTableColumns')}
        defaultTranslateKey='DesignationTeamTable'
        items={designationItems}
      />

      <MedalsInfo/>
    </>
  );
};

export default DivisionTable;
