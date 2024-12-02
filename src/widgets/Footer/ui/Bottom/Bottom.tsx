/* eslint-disable import/first */
import React, { useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { PATHS } from '@/shared/lib/constants/constants';
import { useAppDispatch, useAppSelector } from '@/app/providers/StoreProvider';
import { selectCurrentLeague } from '@/entities/CurrentLeague/model/CurrentLeague';
import { getFooterInfo, selectFooter } from '@/entities/FooterInfo/model/FooterSlice';
import { AnyContact } from '@/entities/FooterInfo/type/footerSchema';
import { NavItem, NavList } from '../Top/NavList';
import classes from './bottom.module.scss';


const creatorName = 'Made by GeekStudio';

export const Bottom = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { leagues, currentLeague, leagueId } = useAppSelector(selectCurrentLeague);
  const { footerInfo } = useAppSelector(selectFooter);

  const navigationOption = [
    {
      label: t('infoCenter'),
      options: [
        {
          label: t('news'),
          href: PATHS.news,
          stay: true,
        }, {
          label: t('catalog'),
          href: PATHS.catalog,
          stay: true,
        },
      ],
    },
    {
      label: t('multimedia'),
      options: [
        {
          label: t('photoGallery'),
          href: PATHS.gallery,
          stay: true,
        }, {
          label: t('video'),
          href: PATHS.videos,
          stay: true,
        },
      ],
    },
    {
      label: t('statistics'),
      options: [
        {
          label: t('bombardiers'),
          href: PATHS.bombardier,
          stay: true,
        },
        {
          label: t('rating'),
          href: PATHS.rating,
          stay: true,
        },
        {
          label: t('archive'),
          href: PATHS.archive,
          stay: true,
        },
      ],
    },
    {
      label: t('footballLeagues'),
      options: leagues.map(league => ({ ...league, label: league.title })),
    },
    {
      label: currentLeague.title,
      labelIcon: currentLeague.logo,
      options: [
        {
          label: t('divisions'),
          href: PATHS.divisions,
          stay: true,
        },
        {
          label: t('cup'),
          href: PATHS.cup,
          stay: true,
        },
        {
          label: t('teams'),
          href: PATHS.teams,
          stay: true,
        },
        {
          label: t('players'),
          href: PATHS.players,
          stay: true,
        },
        {
          label: t('ourTeam'),
          href: PATHS.ourteam,
          stay: true,
        },
        {
          label: t('judges'),
          href: PATHS.referee,
          stay: true,
        },
        {
          label: t('documents'),
          href: PATHS.documents,
          stay: true,
        },
        {
          label: t('sponsors'),
          href: PATHS.sponsors,
          stay: true,
        },
      ],
    },
  ];

  useEffect(() => {
    dispatch(getFooterInfo({ leagueId }));
  }, []);


  return (
    <div className={classes.bottom}>
      <div className={classes.hr}/>
      <div className={classes.content}>
        <a className={classes.creator}
          href="https://www.geekstudio.kg/"
          target='_blank' rel="noreferrer"
        >
          {creatorName}
        </a>

        <div className={classes.hr}/>

        <ul className={classes.socialMedia}>
          {footerInfo.medias?.map((item: AnyContact) => (
            <li key={item.title}>
              <a
                href={item.url}
                target='_blank' rel="noreferrer"
              >
                <img
                  src={item.icon}
                  alt='media icon'
                />
              </a>
            </li>
          ))}
        </ul>

        <nav className={classes.nav}>
          {navigationOption.map(item => (
            <NavList key={item.label} title={item.label} list={item.options as NavItem[]}/>
          ))}
        </nav>
      </div>
    </div>
  );
};
