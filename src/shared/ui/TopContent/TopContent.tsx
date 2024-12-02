import React, { ReactNode } from 'react';
import useIsMobile from '@/shared/lib/hooks/useIsMobile';
import { HTag, HTagProps } from '../HTag/HTag';
import { BreadCrumbs, pages } from '../BreadCrumbs/BreadCrumbs';
import classes from './topContent.module.scss';


interface TopContentProps {
  breadcrumbs: pages;
  children?: ReactNode;
  titleProps?: HTagProps;
  title: ReactNode;
  className?: string;
  showBreadcrumbs?: boolean;
}

const TopContent = ({ breadcrumbs, children, title, titleProps, className, showBreadcrumbs }:TopContentProps) => {
  const isMobile = useIsMobile();

  return (
    <div className={classes.mainBox}>
      <div className={`${classes.topContent} ${className}`}>
        <div className={classes.title}>
          <HTag {...titleProps} myStyle={{ margin: 0 }} level={1}>{title}</HTag>
        </div>

        {(showBreadcrumbs || isMobile) && <div className={classes.breadCrumbs} >
          <BreadCrumbs
            pages={breadcrumbs}
            isVisible={showBreadcrumbs}
          />
        </div>}

        {children}
      </div>

      {!isMobile && <div className={classes.breadCrumbs}>
        <BreadCrumbs
          pages={breadcrumbs}
        />
      </div>}
    </div>
  );
};

export default TopContent;
