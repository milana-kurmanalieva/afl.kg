import { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/providers/StoreProvider';
import { getArchiveRating } from '@/entities/ArchiveChampionship';
import TablePlayer from '@/shared/ui/Table/TablePlayer';
import { TABLE_KEYS } from '@/shared/lib/constants/constants';
import { FilterTypes } from '@/screens/Archive/ui/Archive';
import { getGroupsRating } from '@/entities/ArchiveGroups/model/archiveGroupsSlice';


interface archiveRating {
  currentFilter: string | string[] | undefined
}

export const ArchiveRating:FC<archiveRating> = ({ currentFilter }) => {
  const dispatch = useAppDispatch();


  const { currentCup, filterSuperCup, divisionFilterList, divisionSelect } = useAppSelector((state) => state.archive);
  const { archiveGroupsRatings } = useAppSelector((state) => state.archiveGroups);

  const superCupQuery = currentCup?.is_super_cup ? filterSuperCup?.id === 1 ? '1' : '2' : '';
  const { rating } = useAppSelector((state) => state.archiveChampionShip);
  useEffect(() => {
    // eslint-disable-next-line max-len
    if (currentFilter === FilterTypes.LEAGUE && divisionSelect?.id) {
      if (divisionFilterList?.id || divisionFilterList?.original_division_id) {
        dispatch(getArchiveRating({
          chamId: divisionSelect?.id,
          divisionId: divisionFilterList?.id ?? divisionFilterList?.original_division_id,
        }));
      }
    }
  }, [
    divisionSelect,
    divisionFilterList?.id ?? divisionFilterList?.original_division_id,
    dispatch,
  ]);

  useEffect(() => {
    if (currentFilter === FilterTypes.CUP && currentCup?.cup_id) {
      dispatch(getGroupsRating({
        current_cup: currentCup?.cup_id,
        super_cup: superCupQuery,
      }));
    }
  }, [ currentCup ]);

  return (
    <>
      <TablePlayer
        keys={[
          { label: TABLE_KEYS.COMMAND, key: 'team' },
          { label: TABLE_KEYS.GAMES, key: 'games' },
          { label: TABLE_KEYS.GOALS, key: 'goals' },
          { label: TABLE_KEYS.A, key: 'assists' },
          { label: TABLE_KEYS.P, key: 'yel_cards' },
          { label: TABLE_KEYS.U, key: 'red_cards' },
          { label: 'bestCount', key: 'best_player_count' },
        ]}
        table={currentFilter === FilterTypes.LEAGUE ? rating : archiveGroupsRatings}
        isArchive={true}
      />
    </>
  );
};
