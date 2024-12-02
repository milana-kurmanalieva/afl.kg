/* eslint-disable import/first */
import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { useAppSelector } from '@/app/providers/StoreProvider';
import { selectFooter } from '@/entities/FooterInfo/model/FooterSlice';
import { AnyContact } from '@/entities/FooterInfo/type/footerSchema';
import { NavList } from './NavList';
import classes from './top.module.scss';


export const Top = () => {
  const { t } = useTranslation();
  const { footerInfo } = useAppSelector(selectFooter);

  return (
    <div className={classes.top}>
      <Link href='/' className={classes.logo}/>

      <nav className={classes.nav}>
        {!!footerInfo.phone_numbers?.length && <NavList title={t('contacts')} list={
          footerInfo.phone_numbers.map((item: AnyContact) =>
            ({ label: item.phone_number, href: `tel:${item.phone_number}`, stay: true }),
          )
        }/>}
        {/* {!!footerInfo.addresses?.length && <NavList title={t('address')} list={
          footerInfo.addresses.map((item: AnyContact) => ({ label: item.address }))
        }/>} */}
      </nav>
      {
        !!footerInfo.addresses?.length &&
        <div className={classes.addresses}>
          <h4>{t('address')}</h4>
          <ul>
            {footerInfo.addresses.map((item, itemIndex) => (
              <li key={itemIndex}>
                <a href={item.url} target='_blank'>{item.address}</a>
              </li>
            ))}
          </ul>
        </div>
      }
      {/* <Map/> */}
    </div>
  );
};
