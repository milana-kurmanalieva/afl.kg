import React, { FC, ReactNode } from 'react';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { DoubleArrow } from '../DoubleArrow/DoubleArrow';
import classes from './link.module.scss';


interface IShowAllLink {
  children?: ReactNode;
  href: string;
  className?: string;
  isSection?: boolean;
}

export const ShowAllLink: FC<IShowAllLink> = ({ href, children, className, isSection, ...rest }) => {
  const { t } = useTranslation();

  return (
    <div className={`${classes.link} ${className} ${isSection ? classes.sectionPage : ''}`}>
      <Link {...rest} href={href}>
        {children ?? t('seeAll')}
        <DoubleArrow/>
      </Link>
    </div>
  );
};
