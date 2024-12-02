import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Tabs } from '@/shared/ui/Tabs/Tabs';
import { Tab, TabsWrapperProps } from '../type/TabsSchema';


const TabsWrapper = ({ tabsList, query, variant }:TabsWrapperProps) => {
  const router = useRouter();
  const [ currentTab, setCurrentTab ] = useState<number | undefined>(undefined);

  const handleChangeTab = (tab:Tab) => {
    const pathname = router.pathname;
    const searchParams = `${query}=${tab.value}`;

    router.push({
      pathname: pathname,
      search: searchParams,
    });

    if (currentTab !== tabsList.findIndex(item => item.value === tab.value)) {
      setCurrentTab(prevTab => prevTab ? 0 : 1);
    }
  };

  useEffect(() => {
    const currentTabIndex = tabsList.findIndex(tab => tab.value === router.query[ query ]);
    if (currentTabIndex >= 0) {
      setCurrentTab(currentTabIndex);
      return;
    }
    setCurrentTab(0);
  }, [ router ]);

  return (
    <Tabs
      tabsList={tabsList}
      currentTab={currentTab}
      changeTab={handleChangeTab}
      variant={variant}
    />
  );
};


export default TabsWrapper;
