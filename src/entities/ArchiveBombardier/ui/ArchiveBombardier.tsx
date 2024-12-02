import { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/providers/StoreProvider';
import { getArchiveBombardiers } from '@/entities/ArchiveChampionship';
import TablePlayer from '@/shared/ui/Table/TablePlayer';
import { TABLE_KEYS } from '@/shared/lib/constants/constants';
import { FilterTypes } from '@/screens/Archive/ui/Archive';
import { getGroupsBombardiers } from '@/entities/ArchiveGroups/model/archiveGroupsSlice';


interface ArchiveBombardier {
  currentFilter: string | string[] | undefined
}


export const ArchiveBombardier:FC<ArchiveBombardier> = ({ currentFilter }) => {


  const dispatch = useAppDispatch();

  const { currentCup, filterSuperCup, divisionFilterList, divisionSelect } = useAppSelector((state) => state.archive);
  const { bombardiers } = useAppSelector((state) => state.archiveChampionShip);
  const { archiveGroupsBombardiers } = useAppSelector((state) => state.archiveGroups);


  useEffect(() => {
    if (currentFilter === FilterTypes.LEAGUE) {
      if (divisionFilterList?.id || divisionFilterList?.original_division_id) {
        dispatch(getArchiveBombardiers({
          chamId: divisionSelect?.id,
          divisionId: divisionFilterList?.id ?? divisionFilterList?.original_division_id,
        }));
      }
    }
  }, [
    divisionSelect,
    dispatch,
    divisionFilterList?.original_division_id,
    divisionFilterList?.id,
  ]);

  const superCupQuery = currentCup?.is_super_cup && filterSuperCup?.id === 1 ? '1' : '2';

  useEffect(() => {
    if (currentFilter === FilterTypes.CUP) {
      dispatch(getGroupsBombardiers({ current_cup: currentCup?.cup_id, super_cup: superCupQuery }));
    }
  }, [ currentCup ]);

  return (
    <>
      <TablePlayer
        keys={[
          { label: TABLE_KEYS.COMMAND, key: 'team' },
          { label: TABLE_KEYS.GAMES, key: 'games' },
          { label: TABLE_KEYS.GOALS, key: 'goals' },
        ]}
        table={currentFilter === FilterTypes.LEAGUE ? bombardiers : archiveGroupsBombardiers}
        isArchive={true}
      />
    </>
  );
};
