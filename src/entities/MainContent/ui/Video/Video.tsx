import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
// eslint-disable-next-line import/no-named-as-default
import TablePlayer from '@/shared/ui/Table/TablePlayer';
import { useAppDispatch, useAppSelector } from '@/app/providers/StoreProvider';
import { getBombardier, getCupBombardier, selectBombardier } from '@/entities/Bombardier/model/bombardierSlice';
import { selectDivisions } from '@/entities/Divisions/model/DivisionSlice';
import { PATHS, TABLE_KEYS } from '@/shared/lib/constants/constants';
import { HTag } from '@/shared/ui/HTag/HTag';
import { selectLeagueVideos } from '@/entities/VideosPage/model/VideoPageSlice';
import YouTubeVideo from '@/shared/ui/YouTubeVideo/VideoCard/YouTubeVideo';
import { ShowAllLink } from '@/shared/ui/ShowAllLink/ShowAllLink';
import useIsMobile from '@/shared/lib/hooks/useIsMobile';
import { EmptyState } from '@/shared/ui/EmptyState/EmptyState';
import { selectBanners } from '@/entities/Banners/model/bannersSlice';
import { BannerRow } from '@/entities/Banners';
import { updateMainBannerCounter } from '@/entities/BannerCount/banner';
import { getCurrentCupDescription, getIsOverCup, selectCurrentCup } from '@/entities/CurrentCup/model/currentCupSlice';
import { selectCurrentLeague } from '@/entities/CurrentLeague/model/CurrentLeague';
import classes from './video.module.scss';


const Video = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const { divisions, currentDivision } = useAppSelector(selectDivisions);
  const { bombardier, bombardierStatus, cupBombardiers, cupBombardiersStatus } = useAppSelector(selectBombardier);
  const { mainVideos } = useAppSelector(selectLeagueVideos);
  const { activeMainBanner } = useAppSelector(selectBanners);
  const { leagueId } = useAppSelector(selectCurrentLeague);
  const { currentCup } = useAppSelector(selectCurrentCup);

  const isCupActive = useMemo(() => {
    if (!currentCup) return;
    const now = Date.now();
    const cupEndDate = new Date(currentCup.end_date);
    const cupEndDateInMilSeconds = cupEndDate.getTime();

    return now < cupEndDateInMilSeconds;
  }, [ currentCup ]);

  useEffect(() => {
    if (divisions.length) dispatch(getBombardier({ divisionId: currentDivision.id || divisions[ 0 ]?.id }));
  }, [ currentDivision.id, divisions.length ]);


  useEffect(() => {
    dispatch(getCurrentCupDescription({ leagueId: leagueId }));
    dispatch(getIsOverCup(leagueId));
  }, [ dispatch, leagueId ]);

  useEffect(() => {
    if (currentCup?.id && isCupActive) {
      dispatch(getCupBombardier({ cupId: currentCup.id }));
    }
    if (!currentCup?.id && !isCupActive) {
      dispatch(getBombardier({ divisionId: currentDivision.id }));
    }
  }, [
    dispatch,
    currentCup,
    currentDivision,
  ]);


  return (
    <>
      {!isMobile && <HTag center myStyle={{ marginTop: '50px' }} level={2}>{t('video')}</HTag>}

      <div className={classes.video}>
        <TablePlayer
          isSelectFilter={!!currentCup?.id}
          title={t('bombardiers')}
          isSmall
          showImages
          headerLink={isCupActive ? PATHS.cupBombardiers : PATHS.bombardier}
          status={isCupActive ? cupBombardiersStatus : bombardierStatus}
          table={(isCupActive ? cupBombardiers : bombardier).slice(0, 5)}
          keys={[ { label: TABLE_KEYS.GOALS, key: 'goals' } ]}
        />

        <div className={classes.videoList}>
          {isMobile && <HTag myStyle={{ marginTop: '30px' }} level={3}>{t('video')}</HTag>}
          <ul className={classes.videos}>
            {mainVideos.slice(0, 2).map((video) => (
              <YouTubeVideo
                link={video.url}
                key={video.id}
                title={video.title}
                className={classes.mainVideo}
                isSmall={false}
              />
            ))}
            {!mainVideos.length && <EmptyState/>}
          </ul>
          <ShowAllLink isSection className={classes.showAll} href={PATHS.videos}>{t('seeAll')}</ShowAllLink>
        </div>
        <BannerRow>
          <a
            onClick={() => {
              if (activeMainBanner.banner?.id) updateMainBannerCounter(activeMainBanner.banner?.id);
            }}
            href={activeMainBanner.banner?.link}
            target='_blank'
            className={classes.advertisement}
          >
            {!activeMainBanner.banner && <div className={classes.label}>ADS</div>}
            {activeMainBanner.banner && <img
              src={activeMainBanner.banner.mob_banner
                ? activeMainBanner.banner.mob_banner
                : activeMainBanner.banner.banner
              }
              alt={activeMainBanner.banner.title}
            />}
          </a>
        </BannerRow>
      </div>
    </>
  );
};

export default Video;
