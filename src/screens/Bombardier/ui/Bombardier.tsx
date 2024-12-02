import { NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { Container } from '@/shared/ui/Container/Container';
import TopContent from '@/shared/ui/TopContent/TopContent';
import { FilterSelectOption, PATHS, REQUEST_STATUSES, TABLE_KEYS } from '@/shared/lib/constants/constants';
import FIlterSelect from '@/shared/ui/FIlterSelect/FIlterSelect';
import { Meta } from '@/shared/ui/seo/Meta';
import { useAppDispatch, useAppSelector } from '@/app/providers/StoreProvider';
import {
  getBombardier,
  selectBombardier,
} from '@/entities/Bombardier/model/bombardierSlice';
import { getDivisions, selectDivisions, setCurrentDivision } from '@/entities/Divisions/model/DivisionSlice';
// eslint-disable-next-line import/no-named-as-default
import TablePlayer from '@/shared/ui/Table/TablePlayer';
import Loader from '@/shared/ui/loader/Loader';
import { BannerRow } from '@/entities/Banners';
import { TableInfo } from '@/shared/ui/TableInfo/TableInfo';


const designationItems = [ { translateKey: 'game' }, { translateKey: 'goal' } ];

const Bombardier: NextPage = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const { bombardier, bombardierStatus } = useAppSelector(selectBombardier);
  const { divisions, currentDivision } = useAppSelector(selectDivisions);
  const currentLeague = useAppSelector((state) => state.currentLeague.leagueId);

  const [ isOpen, setIsOpen ] = useState(true);

  const pages = [
    {
      href: '',
      disabled: true,
      page: t('statistics'),
    }, {
      href: PATHS.bombardier,
      page: t('bombardiers'),
    },
  ];

  const handleDivision = (division: FilterSelectOption) => {
    dispatch(setCurrentDivision(division));
    dispatch(getBombardier({ divisionId: division.id }));
  };
  useEffect(() => {
    if (!divisions.length) {
      dispatch(getDivisions({ leagueId: currentLeague }));
    }
  }, [ dispatch, currentLeague ]);

  useEffect(() => {
    if (!bombardier?.length) {
      dispatch(getBombardier({ divisionId: currentDivision.id }));
    }
  }, [
    dispatch,
    currentDivision.id,
    bombardier,
  ]);


  return (
    <>
      <Meta title={t('bombardiers')} description={t('bombardiers') as string}>

      </Meta>
      <Container variant='large'>
        <TopContent
          title={t('bombardiers')}
          breadcrumbs={pages}
        >
          <FIlterSelect
            options={divisions}
            changeOption={handleDivision}
            label={currentDivision?.title}
          />
        </TopContent>

        <BannerRow/>

        {bombardierStatus === REQUEST_STATUSES.SUCCEEDED ? <TablePlayer
          keys={[
            { label: TABLE_KEYS.COMMAND, key: 'team' },
            { label: TABLE_KEYS.GAMES, key: 'games' },
            { label: TABLE_KEYS.GOALS, key: 'goals' },
          ]}
          table={bombardier}
        /> : <Loader center tall/>}

        <TableInfo
          title={t('designationTableColumns')}
          defaultTranslateKey='DesignationPlayerRating'
          items={designationItems}
        />
      </Container>
    </>
  );
};

export default Bombardier;
