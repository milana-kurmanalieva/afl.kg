import { FC, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import MatchesBlock from '@/shared/ui/Matches/MatchesBlock';
import { useAppSelector, useAppDispatch } from '@/app/providers/StoreProvider';
import { getArchiveMatches, setCurrentArchiveTour } from '@/entities/ArchiveChampionship';
import { getArchivedDivisions } from '@/entities/Divisions/model/DivisionSlice';
import { selectCurrentLeague } from '@/entities/CurrentLeague/model/CurrentLeague';
import { FilterTypes } from '@/screens/Archive/ui/Archive';
import { getMatchesCup } from '@/entities/Archive/model/archiveSlice';
import { getCurrentCupDescription } from '@/entities/CurrentCup/model/currentCupSlice';
import FIlterSelect from '@/shared/ui/FIlterSelect/FIlterSelect';
import { FilterSelectOption } from '@/shared/lib/constants/constants';
import { UnCLickableWrapper } from '@/shared/ui/UnClickableWrapper/UnClickableWrapper';
import classes from './ArchiveMatches.module.scss';


const query = 'archive';

interface matches {
  variant: string | string[]
}

export const ArchiveMatches:FC<matches> = ({ variant }) => {
  const dispatch = useAppDispatch();
  const { currentLeague, leagueId } = useAppSelector(selectCurrentLeague);
  const {
    currentArchiveChampionShip,
    matches,
    tourList,
    currentArchiveTour,
  } = useAppSelector((state) => state.archiveChampionShip);

  const {
    matchesCups,
    currentCup,
    filterSuperCup,
    divisionFilterList,
    divisionSelect,
  } = useAppSelector((state) => state.archive);
  const router = useRouter();

  const handleChangeFilters = useMemo(() => (action: any) =>
    (option: FilterSelectOption) => dispatch(action(option)), [ dispatch ]);
  const currentFilter = router.query[ query ];

  // const { currentCup, currentCupGroups } = useAppSelector(selectCurrentCup);

  // useEffect(() => {
  //   dispatch(getCurrentCupGroups({ leagueId }));
  // }, [ leagueId ]);

  // useEffect(() => {
  //   if (currentCupGroups?.length) dispatch(setCurrentGroup(currentCupGroups[ 0 ]));
  // }, [ currentCupGroups.length ]);

  useEffect(() => {
    if (variant === FilterTypes.CUP) {
      dispatch(getCurrentCupDescription({ leagueId: leagueId }));
    }
  }, [ currentCup?.cup_id, variant ]);

  useEffect(() => {
    if (variant === FilterTypes.LEAGUE && !divisionFilterList && leagueId) {
      dispatch(getArchivedDivisions({ leagueId }));
    }
  }, [
    leagueId,
    variant,
    divisionFilterList,
    dispatch,
  ]);
  const superCupQuery = currentCup?.is_super_cup && filterSuperCup?.id === 1 ? '1' : '2';

  useEffect(() => {
    if (variant === FilterTypes.LEAGUE
      && divisionSelect?.id &&
       currentArchiveTour?.id) {
      if (divisionFilterList?.id || divisionFilterList?.original_division_id) {
        dispatch(getArchiveMatches({
          chamId: divisionSelect?.id,
          divisionId: divisionFilterList.id ?? divisionFilterList.original_division_id,
          tourId: currentArchiveTour.id,
        }));
      }
    }
    if (variant === FilterTypes.CUP) {
      dispatch(getMatchesCup({
        currentCup: currentCup?.cup_id,
        is_super_cup: superCupQuery,
      }));
    }

  }, [
    divisionSelect?.id,
    divisionFilterList?.id,
    currentArchiveTour?.id,
    currentCup?.cup_id,
    currentCup?.is_super_cup,
    variant,
    dispatch,
  ]);

  return (
    <>
      {currentFilter === FilterTypes.LEAGUE &&
        <div style={{ display: 'flex' }}>
          <FIlterSelect
            options={tourList}
            changeOption={handleChangeFilters(setCurrentArchiveTour)}
            label={currentArchiveTour?.title as string}
          />
        </div>
      }
      <UnCLickableWrapper>
        <div className={classes.matches}>
          <MatchesBlock
            title={divisionFilterList?.title as string}
            matches={variant === FilterTypes.LEAGUE ? matches : matchesCups}
            tourList={tourList}
          />
        </div>
      </UnCLickableWrapper>
    </>
  );
};
