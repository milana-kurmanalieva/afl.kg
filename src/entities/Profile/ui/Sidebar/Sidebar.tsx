import React, { useMemo } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { HTag } from '@/shared/ui/HTag/HTag';
import { Button } from '@/shared/ui/Button/Button';
import { BUTTON_VARIANTS, Directions, PATHS } from '@/shared/lib/constants/constants';
import list from '@/icons/profile/list.svg';
import setting from '@/icons/profile/setting.svg';
import shop from '@/icons/profile/shop.svg';
import { useAppDispatch, useAppSelector } from '@/app/providers/StoreProvider';
import { logout, selectAuth } from '@/entities/Auth/model/authSlice';
import { Arrow } from '@/shared/ui/Arrow/Arrow';
import classes from './sidebar.module.scss';


const Sidebar = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { user } = useAppSelector(selectAuth);

  const navList = useMemo(() => ([
    {
      href: PATHS.profileFields,
      label: t('listOfFields'),
      icon: list.src,
      active: router.asPath === PATHS.profileFields,
      hide: !user?.is_business_owner,
    },
    {
      href: PATHS.profileShops,
      label: t('listOfShops'),
      icon: shop.src,
      active: router.asPath === PATHS.profileShops,
      hide: !user?.is_business_owner,
    },
    {
      href: PATHS.profileSettings,
      label: t('profileSettings'),
      icon: setting.src,
      active: router.asPath === PATHS.profileSettings,
    },
  ]), [ user?.is_business_owner, router ]);

  const handleLogout = async () => {
    await dispatch(logout());
    await router.push(PATHS.home);
    window.location.reload();
  };

  if (!user) return <></>;

  return (
    <aside className={classes.sidebar}>
      <div className={classes.name}>
        <HTag level={4}>{user.full_name ? user.full_name : t('login')}</HTag>
        {user.is_business_owner && <p>{t('businessProfile')}</p>}
      </div>

      <nav>
        <ul className={classes.navItems}>
          {navList.filter(item => !item.hide).map(item => (
            <li
              onClick={() => router.push(item.href)}
              className={item.active ? classes.active : ''}
              key={item.href}
            >
              <div className={classes.navItemContent}>
                <div className={classes.iconContainer}><img src={item.icon} alt='list'/></div>
                <p>{item.label}</p>
              </div>
              <Arrow className={classes.arrow} direction={Directions.right}/>
            </li>
          ))}
        </ul>
        <Button
          onClick={handleLogout}
          className={classes.logoutBtn}
          variant={BUTTON_VARIANTS.DELETE}
        >{t('logOutOfYourAccount')}</Button>
      </nav>
    </aside>
  );
};

export default Sidebar;
