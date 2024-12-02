import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/app/providers/StoreProvider';
import FIlterSelect from '@/shared/ui/FIlterSelect/FIlterSelect';
import { selectCurrentLeague } from '@/entities/CurrentLeague/model/CurrentLeague';
import { FilterSelectOption } from '@/shared/lib/constants/constants';
import { HTag } from '@/shared/ui/HTag/HTag';
import WinnersCard from '@/shared/ui/WinnersCard/WinnersCard';
import useMediaQuery from '@/shared/lib/hooks/useMediaQuery';
import { getWinners, getWinnerTeams, selectWinners, setDivisionSelect } from '../model/winnersSlice';
import classes from './MainWinnerTeams.module.scss';


const WinnerTeams = () => {
  const dispatch = useAppDispatch();
  const { data, divisionSelect, winnerTeams } = useAppSelector(selectWinners);
  const { leagueId } = useAppSelector(selectCurrentLeague);
  const { t } = useTranslation();
  const isMobile = useMediaQuery('(max-width: 820px)');

  const handleChangeOptions = (division: FilterSelectOption): void | null => {
    dispatch(setDivisionSelect(division));
  };

  const mappedOptions = data?.map(item => ({
    title: item.name,
    id: item.original_division_id,
  })) || [];

  const rearrangedData = [
    winnerTeams[ 1 ],
    winnerTeams[ 0 ],
    winnerTeams[ 2 ],
  ];

  useEffect(() => {
    dispatch(getWinners(leagueId));
  }, [ dispatch, leagueId ]);

  useEffect(() => {
    if (divisionSelect) {
      dispatch(getWinnerTeams({ leagueId, divisionId: divisionSelect.id }));
    }
  }, [
    dispatch,
    leagueId,
    divisionSelect,
  ]);

  useEffect(() => {
    if (data && data.length > 0 && !divisionSelect) {
      const defaultDivision = {
        title: data[ 0 ].name,
        id: data[ 0 ].original_division_id,
      };
      dispatch(setDivisionSelect(defaultDivision));
    }
  }, [
    data,
    divisionSelect,
    dispatch,
  ]);

  return (
    <>
      {(data && data.length > 0 && !isMobile) && (
        <div className={classes.winnersOfSeason}>
          <div className={classes.winnersTitle}>
            <HTag level={5}>{t('winnersOfSeasons')}</HTag>
          </div>
          <FIlterSelect
            menuDirection={true}
            options={mappedOptions}
            label={divisionSelect?.title || mappedOptions[ 0 ].title}
            changeOption={handleChangeOptions}
          />
          <div className={classes.winners}>
            {rearrangedData && rearrangedData.map((team, index) => (
              <WinnersCard key={index} {...team} index={index}/>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default WinnerTeams;
