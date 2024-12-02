import { NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { Container } from '@/shared/ui/Container/Container';
import TopContent from '@/shared/ui/TopContent/TopContent';
import { ISuperCupResult, PATHS, REQUEST_STATUSES, TABLE_KEYS } from '@/shared/lib/constants/constants';
import { Meta } from '@/shared/ui/seo/Meta';
import { useAppDispatch, useAppSelector } from '@/app/providers/StoreProvider';
import {
  getCupBombardier,
  selectBombardier,
  getSupercupBombardirs,
} from '@/entities/Bombardier/model/bombardierSlice';
// eslint-disable-next-line import/no-named-as-default
import TablePlayer from '@/shared/ui/Table/TablePlayer';
import Loader from '@/shared/ui/loader/Loader';
import { BannerRow } from '@/entities/Banners';
import { TableInfo } from '@/shared/ui/TableInfo/TableInfo';
import {
  getCurrentCupDescription,
  getCurrentSuperCup,
  selectCurrentCup,
} from '@/entities/CurrentCup/model/currentCupSlice';
import { EmptyState } from '@/shared/ui/EmptyState/EmptyState';
import { Tabs } from '@/shared/ui/Tabs/Tabs';
import { Tab } from '@/entities/Tabs/type/TabsSchema';


const limit = 20;

const designationItems = [ { translateKey: 'game' }, { translateKey: 'goal' } ];

const CupBombardier: NextPage = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const { cupBombardiers, cupBombardiersStatus, superCupBombardiers } = useAppSelector(selectBombardier);
  const { currentCup } = useAppSelector(selectCurrentCup);
  const [ divisionKey, setDivisionKey ] = useState(0);
  const currentLeague = useAppSelector((state) => state.currentLeague.leagueId);
  const { superCupData } = useAppSelector(selectCurrentCup);
  const [ superCupId, setSuperCupId ] = useState<ISuperCupResult>();
  const [ currentTab, setCurrentTab ] = useState<number>(0);

  const tabsList: Tab<string>[] = (superCupData?.results ?? []).map((item, index) => ({
    value: index.toString(),
    label: item.label,
  }));

  useEffect(() => {
    const saveTab = sessionStorage.getItem('activeTabBombardirs');
    if (saveTab !== null) {
      const tabValue = parseInt(saveTab);
      setCurrentTab(tabValue);
      setDivisionKey(tabValue);
    }
  }, []);

  useEffect(() => {
    if (!superCupData?.results) {
      return;
    }
    const selectedSuperCup = superCupData?.results.find((superCup) => superCup.value === divisionKey);
    setSuperCupId(selectedSuperCup);
  }, [ divisionKey, superCupData ]);

  const pages = [
    {
      href: '',
      disabled: true,
      page: t('statistics'),
    }, {
      href: PATHS.cupBombardiers,
      page: t('cupBombardiers'),
    },
  ];

  const handleSwitchDivision = (tab: Tab<string>) => {
    const tabValue = parseInt(tab.value);
    setDivisionKey(tabValue);
    setCurrentTab(tabValue);
    sessionStorage.setItem('activeTabBombardirs', tab.value);
  };

  useEffect(() => {
    dispatch(getCurrentSuperCup());
  }, []);

  useEffect(() => {
    dispatch(getCurrentCupDescription({ leagueId: currentLeague }));
  }, [ dispatch, currentLeague ]);

  useEffect(() => {
    if (currentCup?.id && superCupId?.id) {
      dispatch(getCupBombardier({ cupId: currentCup.id, limit: limit, offset: cupBombardiers.length }));
      dispatch(getSupercupBombardirs(
        {
          cupId: currentCup?.id,
          isSuperCup: currentCup?.is_super_cup ? true : false,
          superCupId: superCupId.id,
        }));
    }
  }, [
    dispatch,
    currentCup,
    superCupId,
    cupBombardiers.length,
  ]);

  return (
    <>
      <Meta title={t('cupBombardiers')} description={t('cupBombardiers') as string}>

      </Meta>
      <Container variant='large'>
        <TopContent
          title={t('cupBombardiers')}
          breadcrumbs={pages}
        >
        </TopContent>

        <BannerRow/>
        {currentCup?.is_super_cup && (
          <Tabs
            variant="newYork"
            tabsList={tabsList}
            currentTab={currentTab}
            changeTab={handleSwitchDivision}
          />)
        }

        {cupBombardiersStatus === REQUEST_STATUSES.SUCCEEDED && cupBombardiers.length ? <>
          <TablePlayer
            keys={[
              { label: TABLE_KEYS.COMMAND, key: 'team' },
              { label: TABLE_KEYS.GAMES, key: 'games' },
              { label: TABLE_KEYS.GOALS, key: 'goals' },
            ]}
            table={superCupBombardiers}
          />
          <TableInfo
            title={t('designationTableColumns')}
            defaultTranslateKey='DesignationPlayerRating'
            items={designationItems}
          />
        </> : !currentCup?.id ?
          <EmptyState/> : <Loader center tall/>}

      </Container>
    </>
  );
};

export default CupBombardier;
