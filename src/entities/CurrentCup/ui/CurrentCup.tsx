import React, { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/providers/StoreProvider';
import { selectCurrentLeague } from '@/entities/CurrentLeague/model/CurrentLeague';
import { Tabs } from '@/shared/ui/Tabs/Tabs';
import { Tab } from '@/entities/Tabs/type/TabsSchema';
import { ISuperCupResult } from '@/shared/lib/constants/constants';
import LayoutTabs from '@/shared/ui/LayoutTabs/LayoutTabs';
import { getCurrentCupStages, getCurrentSuperCup, selectCurrentCup } from '../model/currentCupSlice';
import classes from './currentCup.module.scss';
import { Groups } from './Groups';
import PlayOff from './PlayOff';


const CurrentCup = () => {
  const dispatch = useAppDispatch();
  const [ activeKey, setActiveKey ] = useState('1');
  const [ divisionKey, setDivisionKey ] = useState(0);
  const { currentCupStages, superCupData } = useAppSelector(selectCurrentCup);
  const [ superCupId, setSuperCupId ] = useState<ISuperCupResult>();
  const { leagueId } = useAppSelector(selectCurrentLeague);
  const { currentCup } = useAppSelector(selectCurrentCup);


  const defaultTab = useMemo(() => {
    return currentCupStages.length ? '2' : '1';
  }, [ currentCupStages ]);

  useEffect(() => {
    setActiveKey(defaultTab);
  }, [ defaultTab ]);

  const handleSwitchDivision = (tab: Tab<string>) => {
    setDivisionKey(parseInt(tab.value));
  };

  useEffect(() => {
    if (leagueId) {
      dispatch(getCurrentCupStages({ leagueId }));
      dispatch(getCurrentSuperCup());
    }
  }, [ dispatch, leagueId ]);


  useEffect(() => {
    if (!superCupData?.results) {
      return;
    }
    const selectedSuperCup = superCupData?.results.find((superCup) => superCup.value === divisionKey);
    setSuperCupId(selectedSuperCup);
  }, [ divisionKey, superCupData ]);

  const renderContent = () => {
    if (activeKey === '1' && superCupId) {
      return <Groups superCupId={superCupId?.id} />;
    }
    if (activeKey === '2' && superCupId) {
      return <PlayOff superCupId={superCupId?.id} activeKey={activeKey}/>;
    }
    return null;
  };

  const tabsList: Tab<string>[] = (superCupData?.results ?? []).map((item, index) => ({
    value: index.toString(),
    label: item.label,
  }));

  return (
    <div>
      <div className={classes.filters}>
        <LayoutTabs activeKey={activeKey} setActiveKey={setActiveKey} />
        {currentCup?.is_super_cup && (
          <div className={classes.customContent}>
            <Tabs
              variant="newYork"
              tabsList={tabsList}
              currentTab={divisionKey}
              changeTab={handleSwitchDivision}
            />
          </div>
        )}
        <div className={classes.tabContent}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default CurrentCup;
