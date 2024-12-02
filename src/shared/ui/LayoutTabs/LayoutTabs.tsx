import React from 'react';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { useTranslation } from 'react-i18next';


interface LayoutTabsProps {
  activeKey: string;
  setActiveKey: (key: string) => void;
}

const LayoutTabs: React.FC<LayoutTabsProps> = ({ activeKey, setActiveKey }) => {
  const { t } = useTranslation();

  const tabs: TabsProps['items'] = [
    {
      key: '1',
      label: t('groupStage'),
    }, {
      key: '2',
      label: t('playoffs'),
    },
  ];

  return <Tabs onChange={setActiveKey} activeKey={activeKey} items={tabs} />;
};

export default LayoutTabs;
