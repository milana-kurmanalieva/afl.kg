import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { Container } from '@/shared/ui/Container/Container';
import { useAppDispatch } from '@/app/providers/StoreProvider';
import { getDivisions, selectDivisions, setCurrentDivision } from '@/entities/Divisions/model/DivisionSlice';
import { selectCurrentLeague } from '@/entities/CurrentLeague/model/CurrentLeague';
import { REQUEST_STATUSES, FilterSelectOption } from '@/shared/lib/constants/constants';
import {
  getTours,
  selectChampionship,
  setCurrentTour,
} from '@/entities/Championship/model/ChampionShipSlice';
import TopContent from '@/shared/ui/TopContent/TopContent';
import FilterSelect from '@/shared/ui/FIlterSelect/FIlterSelect';
import { Meta } from '@/shared/ui/seo/Meta';
import { DivisionTable } from '@/entities/Divisions';
import Loader from '@/shared/ui/loader/Loader';


const Divisions:NextPage = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { divisions, divisionsStatus, currentDivision } = useSelector(selectDivisions);
  const { tours, toursStatus, currentTour } = useSelector(selectChampionship);
  const { leagueId, currentLeague } = useSelector(selectCurrentLeague);

  const pages = [
    {
      href: '',
      page: currentLeague.title,
      disabled: true,
    }, {
      href: '/divisions',
      page: t('divisions'),
    },
  ];

  const handleChangeDivision = (division:FilterSelectOption) => {
    dispatch(setCurrentDivision(division));
  };

  const handleChangeTour = (tour:FilterSelectOption) => {
    dispatch(setCurrentTour(tour));
  };

  useEffect(() => {
    if (!divisions.length) {
      dispatch(getDivisions({ leagueId }));
    }
  }, [ ]);

  useEffect(() => {
    if (!tours.length && divisions.length) {
      dispatch(getTours({ division: currentDivision }));
    }
  }, [ divisions ]);

  useEffect(() => {
    if (currentDivision.tour) {
      handleChangeTour({
        id: currentDivision.tour.id,
        title: `${currentDivision.tour.number} тур`,
      });
    }
  }, [ currentDivision.id ]);


  return (<>
    <Meta title={t('divisions')} description={t('divisions') as string}>
    </Meta>

    <Container variant='large'>
      <TopContent
        title={t('divisions')}
        breadcrumbs={pages}
      >
        <FilterSelect
          label={currentDivision?.title}
          changeOption={handleChangeDivision}
          options={divisions}
        />

        <FilterSelect
          label={currentTour?.title}
          changeOption={handleChangeTour}
          options={tours}
        />
      </TopContent>
      {divisionsStatus === REQUEST_STATUSES.SUCCEEDED && toursStatus === REQUEST_STATUSES.SUCCEEDED ? (
        <DivisionTable/>
      ) : <Loader center/>}
    </Container>
  </>
  );
};


export default Divisions;
