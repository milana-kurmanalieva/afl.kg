import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import { Inter } from 'next/font/google';
import { setCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import { Footer } from '@/widgets/Footer/ui/Footer';
import Header from '@/widgets/Header';
import { PollsButton } from '@/entities/Polls';
import { WhatsAppIcon } from '@/entities/WhatsApp';
import { useAppDispatch, useAppSelector } from '@/app/providers/StoreProvider';
import { changeLeague, getLeagues, selectCurrentLeague } from '@/entities/CurrentLeague/model/CurrentLeague';
import { AUTH_PATHS, FilterSelectOption, LEAGUES_KEY, PATHS, REQUEST_STATUSES } from '@/shared/lib/constants/constants';
import { getProfile } from '@/entities/Auth/model/authSlice';
import { MobileLogo } from '../../Logo/Logo';
import Loader from '../../loader/Loader';
import classes from './layout.module.scss';


interface LayoutProps {
  children: ReactNode;
}

export const inter = Inter({
  weight: [
    '300',
    '400',
    '500',
  ],
  style: [ 'normal' ],
  subsets: [
    'latin',
    'latin-ext',
    'cyrillic',
    'cyrillic-ext',
  ],
});

const Layout = ({ children }: LayoutProps) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { pathname } = router;

  const { leagues, leaguesStatus, leagueId } = useAppSelector(selectCurrentLeague);

  const [ isMounted, setIsMounted ] = useState(false);

  const isLeagueSelected = useMemo(() => {
    if (!isMounted || typeof localStorage === 'undefined') return;
    const localLeague = localStorage.getItem(LEAGUES_KEY);

    if (localLeague || leagues.some((item) => item.default)) return true;
    return;
  }, [
    isMounted,
    leagues,
    leagueId,
  ]);

  const handleSelectInitialLeague = (league: FilterSelectOption) => {
    dispatch(changeLeague(league));
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(LEAGUES_KEY, league.id.toString());
      setCookie(LEAGUES_KEY, league.id.toString());
    }
    window.location.reload();
  };

  useEffect(() => {
    dispatch(getLeagues());
    dispatch(getProfile());
    setIsMounted(true);
  }, [ ]);

  useEffect(() => {
    const defaultLeague = leagues.find((league) => league.default);

    if (defaultLeague && !isLeagueSelected) {
      handleSelectInitialLeague(defaultLeague);
    }
  }, [ leagues, isLeagueSelected ]);

  useEffect(() => {
    if (isMounted && !isLeagueSelected) {
      router.push(PATHS.home); // Redirect to the initial URL
    }
  }, [
    isMounted,
    isLeagueSelected,
    router,
  ]);

  return (
    <div className={`${classes.wrapper} ${pathname === PATHS.home && isMounted && !isLeagueSelected
      ? classes.leaguesWrapper : ''}`}>
      <style jsx global>{`
            html {
              font-family: ${inter.style.fontFamily};
            }
      `}</style>

      {AUTH_PATHS.includes(pathname) && children}

      {pathname === PATHS.home
        && isMounted
        && !isLeagueSelected && (
        <>
          {leaguesStatus === REQUEST_STATUSES.REQUESTED && <div className={classes.loader}>
            <Loader />
          </div>}
          {leaguesStatus === REQUEST_STATUSES.SUCCEEDED && <div className={classes.leaguesModal}>
            <div className={classes.logo}>
              <MobileLogo />
            </div>
            <h2>Выберите лигу</h2>
            <ul>
              {leagues.map((item) => (
                <li onClick={() => handleSelectInitialLeague(item)} key={item.id}>
                  {item.logo && <img src={item.logo} alt="league logo" />}
                  <span>{item.title}</span>
                </li>
              ))}
            </ul>
          </div>}
        </>
      )}

      {isLeagueSelected && isMounted && !AUTH_PATHS.includes(pathname) && <>
        <Header />
        <main>
          {children}
          <WhatsAppIcon />
          <PollsButton />
        </main>
        <Footer />
      </>}
    </div>
  );
};

export default Layout;
