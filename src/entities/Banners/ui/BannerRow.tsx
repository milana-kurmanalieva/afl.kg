import React, { FC, ReactNode, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/providers/StoreProvider';
import useIsMobile from '@/shared/lib/hooks/useIsMobile';
import { updateBannerCounter } from '@/entities/BannerCount/banner';
import { getBanners, getMainBanners, selectBanners, setActiveBanner, setActiveMainBanner } from '../model/bannersSlice';
import classes from './banner.module.scss';


const BANNER_CHANGE_DELAY = 5000;

interface IBannerRow {
  children?: ReactNode;
}

const BannerRow: FC<IBannerRow> = ({ children }) => {
  const dispatch = useAppDispatch();
  const isMobile = useIsMobile();

  const { banners, activeBanner, mainBanners, activeMainBanner } = useAppSelector(selectBanners);
  const [ isBannerHidden, setIsBannerHidden ] = useState(false);

  const updateBanner = () => {
    const idx = activeBanner.index === banners.length - 1 ? 0 : activeBanner.index + 1;
    const newBanner = banners[ idx ];

    const mainIdx = activeMainBanner.index === mainBanners.length - 1 ? 0 : activeMainBanner.index + 1;
    const newMainBanner = mainBanners[ idx ];

    if (idx !== activeBanner.index) dispatch(setActiveBanner({ banner: newBanner, index: idx }));
    if (mainIdx !== activeMainBanner.index) dispatch(setActiveMainBanner({ banner: newMainBanner, index: mainIdx }));

    setIsBannerHidden(false);
  };


  useEffect(() => {
    dispatch(getBanners());
    dispatch(getMainBanners());
  }, []);

  useEffect(() => {
    if (!activeBanner.banner || !banners.length) return;

    const timeoutId = setTimeout(updateBanner, BANNER_CHANGE_DELAY);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [ activeBanner.banner, banners ]);

  if (!banners.length || isBannerHidden || !activeBanner.banner) return <></>;

  if (children) return (
    <>
      {children}
    </>
  );

  return (
    <div className={classes.wrapperBanner}>
      <a
        onClick={() => {
          if (activeBanner.banner?.id) updateBannerCounter(activeBanner.banner?.id);
        }}
        href={activeBanner.banner.link}
        target='_blank'
        style={{
          background:
          `url(${(isMobile && activeBanner.banner.mob_banner) ?
            activeBanner.banner.mob_banner :
            activeBanner.banner.banner}) no-repeat center`,
        }}
        className={classes.banner}
      />
    </div>
  );
};

export default BannerRow;
