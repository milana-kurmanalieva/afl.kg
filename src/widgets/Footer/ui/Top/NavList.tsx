import React from 'react';
import Link from 'next/link';
import { PATHS } from '@/shared/lib/constants/constants';
import classes from './top.module.scss';


export interface NavItem {
  href?: string;
  label: string;
  stay?: boolean;
}

interface NavListProps {
  list: Array<NavItem>;
  title: string;
}

export const NavList = ({ list, title }:NavListProps) => {
  return (
    <div className={classes.navList}>
      <h4>{title}</h4>
      <ul>
        {list.map((item, itemIndex) => (
          <li key={itemIndex}>
            {item.href ? <Link
              href={item.href ?? PATHS.home}
              target={!item.stay ? '_blank' : ''} rel="noreferrer"
            >
              {item.label}
            </Link> : item.label}
          </li>
        ))}
      </ul>
    </div>
  );
};
