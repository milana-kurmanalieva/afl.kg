import React, { FC } from 'react';
import { useTranslation } from 'next-i18next';
import { HTag } from '../HTag/HTag';
import classes from './info.module.scss';


export interface IInfoItem {
  translateKey: string
}

interface ITableInfo {
  items: IInfoItem[];
  defaultTranslateKey?: string;
  title: string;
  caption?: string;
}

export const TableInfo: FC<ITableInfo> = ({ defaultTranslateKey, items, title, caption }) => {
  const { t } = useTranslation();

  return (
    <div className={classes.info}>
      <HTag level={4}>
        {title}:
      </HTag>
      <ul className={classes.infoList}>
        {items.map(item => (
          <li key={item.translateKey}>{t(`${item.translateKey}${defaultTranslateKey ?? ''}`)}</li>
        ))}
      </ul>
      {!!caption && <p className={classes.caption}>{caption}</p>}
    </div>
  );
};
