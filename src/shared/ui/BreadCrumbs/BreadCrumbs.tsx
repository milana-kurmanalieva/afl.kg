import React from 'react';
import { useTranslation } from 'next-i18next';
import classes from './breadCrumbs.module.scss';
import { Crumb } from './Crumb';


export type pages = Array<{
  href: string,
  page: string,
  disabled?: boolean;
}>

interface BreadCrumbsProps {
  pages: pages;
  isVisible?: boolean;
}

export const BreadCrumbs = ({ pages, isVisible }:BreadCrumbsProps) => {
  const { t } = useTranslation();
  if (!pages.length) return <></>;

  const pathItems = [
    {
      href: '/',
      page: t('home'),
    }, ...pages,
  ];

  return (
    <div
      className={`${classes.breadcrumbs} ${isVisible ? classes.visible : ''}`}
    >
      <ul className={classes.crumbs}>
        {pathItems.map(({ href, page, disabled }, index) => (
          <Crumb
            key={href}
            href={href}
            page={page}
            last={index === pathItems.length - 1}
            disabled={disabled}
          />
        ))}
      </ul>
    </div>
  );
};
