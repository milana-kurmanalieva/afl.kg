import Link from 'next/link';
import React from 'react';
import { truncateText } from '@/shared/lib/helpers/helpers';
import classes from './breadCrumbs.module.scss';


interface CrumbProps {
  href: string;
  page: string;
  last?: boolean;
  disabled?: boolean;
}

export const Crumb = ({ href, page, last = false, disabled }:CrumbProps) => {
  const truncatedPage = truncateText(page, 20);
  if (last) return <li className={classes.currentCrumb}>{truncatedPage}</li>;
  if (disabled) return <li className={`${classes.currentCrumb} ${classes.crumb}`}>{truncatedPage} <Dot/></li>;

  return (
    <li key={href} className={classes.crumb}>
      <Link
        className={classes.link}
        href={href.length > 1 ? href : '/'}
      >
        {truncatedPage}
      </Link>
      <Dot/>
    </li>
  );
};


function Dot () {
  return (
    <div className={classes.dot}>
      .
    </div>
  );
}
