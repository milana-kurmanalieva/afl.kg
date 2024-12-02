import React from 'react';
import { TabsProps, TabVariants } from '@/entities/Tabs/type/TabsSchema';
import { BUTTON_VARIANTS } from '@/shared/lib/constants/constants';
import { Button } from '../Button/Button';
import classes from './tabs.module.scss';


export const Tabs = ({ tabsList, currentTab, changeTab, variant = 'default' }: TabsProps) => {
  const btnStyleVariants: TabVariants = {
    default: classes.default,
    videoGallery: classes.videoGallery,
    newYork: classes.newYork,
  };

  if (variant === 'newYork') {
    return (
      <div className={classes.tabsNewYork}>
        {tabsList.map((tab, index) => (
          <Button
            className={classes.btnNewYork}
            key={tab.value}
            variant={index === currentTab ? BUTTON_VARIANTS.NEW_YORK_PRIMARY : BUTTON_VARIANTS.NEW_YORK_GHOST}
            onClick={() => changeTab(tab)}
          >{tab.label}</Button>
        ))}
      </div>
    );
  }

  if (variant === 'videoGallery') {
    return <div className={classes.tabsVideo}>
      {tabsList.map((tab, index) => (
        <Button
          className={classes.btnVideo}
          key={tab.value}
          variant={index === currentTab ? BUTTON_VARIANTS.PRIMARY : BUTTON_VARIANTS.OUTLINED}
          onClick={() => changeTab(tab)}
        >{tab.label}</Button>
      ))}
    </div>;
  }

  return (
    <div className={classes.tabs}>
      {tabsList.map((tab, index) => (
        <Button
          className={`${(tabsList[ index + 1 ] && tabsList[ index - 1 ]) ? classes.betweenTab : ''
          }
          ${btnStyleVariants[ variant ]}
          `}
          key={tab.value}
          variant={index === currentTab ? BUTTON_VARIANTS.PRIMARY : BUTTON_VARIANTS.OUTLINED}
          onClick={() => changeTab(tab)}
        >{tab.label}</Button>
      ))}
    </div>
  );
};
