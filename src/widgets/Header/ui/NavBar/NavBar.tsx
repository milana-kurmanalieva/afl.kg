import React, { FC } from 'react';
import { useRouter } from 'next/router';
import { setCookie } from 'nookies';
import { useTranslation } from 'next-i18next';
import FIlterSelect from '@/shared/ui/FIlterSelect/FIlterSelect';
// eslint-disable-next-line import/namespace
import { FilterSelectOption, LEAGUES_KEY, PATHS } from '@/shared/lib/constants/constants';
import { useAppDispatch, useAppSelector } from '@/app/providers/StoreProvider';
import { changeLeague, selectCurrentLeague } from '@/entities/CurrentLeague/model/CurrentLeague';
import classes from './nav.module.scss';


interface INavOption {
  label: string;
  labelIcon?: string;
  id?: string | number;
  options: FilterSelectOption[]
  isInitialOpen?: boolean;
}


interface INavBar {
  closeMenu?: () => void;
}

export const NavBar: FC<INavBar> = ({ closeMenu = () => null }) => {
  const router = useRouter();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { leagues, currentLeague } = useAppSelector(selectCurrentLeague);

  const handleChangeHeader = (option: FilterSelectOption) => {
    closeMenu();
    if (option.href) router.push(option.href);
  };

  const handleLeagueChange = async (option: FilterSelectOption) => {
    dispatch(changeLeague(option));

    setCookie(null, LEAGUES_KEY, option.id.toString(), { maxAge: 30 * 24 * 60 * 60 });

    setTimeout(() => window.location.reload(), 500);
  };

  const navigationOptions: INavOption[] = [
    {
      label: t('infoCenter'),
      options: [
        {
          title: t('news'),
          href: PATHS.news,
          id: 1,
        },
        {
          title: t('catalog'),
          href: PATHS.catalog,
          id: 2,
        },
        {
          title: t('aboutUs'),
          href: PATHS.aboutUs,
          id: 3,
        },
      ],
    },
    {
      label: currentLeague.title,
      labelIcon: currentLeague.logo,
      options: [
        {
          title: t('tournamentTableLabel'),
          href: PATHS.divisions,
          id: 1,
        },
        {
          title: t('cup'),
          href: PATHS.cup,
          id: 2,
        },
        {
          title: t('teams'),
          href: PATHS.teams,
          id: 3,
        },
        {
          title: t('players'),
          href: PATHS.players,
          id: 4,
        },
        {
          title: t('ourTeam'),
          href: PATHS.ourteam,
          id: 1,
        },
        {
          title: t('judges'),
          href: PATHS.referee,
          id: 2,
        },
        {
          title: t('documents'),
          href: PATHS.documents,
          id: 3,
        },
        {
          title: t('sponsors'),
          href: PATHS.sponsors,
          id: 4,
        },
        {
          title: t('blackList'),
          href: PATHS.blackList,
          id: 5,
        },
      ],
    },
    {
      label: t('multimedia'),
      options: [
        {
          title: t('photoGallery'),
          href: PATHS.gallery,
          id: 1,
        }, {
          title: t('video'),
          href: PATHS.videos,
          id: 2,
        },
      ],
    },
    {
      label: t('statistics'),
      options: [
        {
          title: t('bombardiers'),
          href: PATHS.bombardier,
          id: 1,
        },
        {
          title: t('cupBombardiers'),
          href: PATHS.cupBombardiers,
          id: 2,
        },
        {
          title: t('rating'),
          href: PATHS.rating,
          id: 3,
        },
        {
          title: t('cupPlayersRating'),
          href: PATHS.cupRating,
          id: 4,
        },
        {
          title: t('archive'),
          href: PATHS.archive,
          id: 5,
        },
      ],
    },
    {
      id: LEAGUES_KEY,
      label: t('footballLeagues'),
      options: leagues,
    },
    // {
    //   label: 'Форум',
    //   options: [ { href: 'https://afl.geekstudio.kg/forum/', id: 1, title: '' } ],
    // },
  ];


  return (
    <ul className={classes.navigationList}>
      {navigationOptions.map(item => (
        <li key={item.label}>
          {item.id === LEAGUES_KEY ? (
            <FIlterSelect
              secondary
              options={item.options}
              changeOption={handleLeagueChange}
              label={item?.label}
              labelIcon={item.labelIcon && item.labelIcon}
              hover
            />
          ) : (
            item.label === 'Форум' ? (
              <div className={classes.linkBlock}>
                <a target='blank' href={item.options[ 0 ].href} className={classes.link} onClick={closeMenu}>
                  {item.label}
                </a>
              </div>
            ) : (
              <FIlterSelect
                secondary
                options={item.options}
                changeOption={handleChangeHeader}
                label={item?.label}
                labelIcon={item.labelIcon && item.labelIcon}
                hover
              />
            )
          )}
        </li>
      ))}
    </ul>
  );
};
