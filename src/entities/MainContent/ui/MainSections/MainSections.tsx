import { useMemo } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useAppSelector } from '@/app/providers/StoreProvider';
import { selectSponsors } from '@/entities/Sponsors/model/SponsorsSlice';
import SponsorCard from '@/shared/ui/SponsorCard/SponsorCard';
import Slider from '@/shared/ui/Slider/Slider';
import { selectPhotoGallery } from '@/entities/PhotoGallery/model/PhotoGallerySlice';
import NewsCard from '@/shared/ui/News/NewsCard/NewsCard';
import { BannerRow } from '@/entities/Banners';
import { selectDivisions } from '@/entities/Divisions/model/DivisionSlice';
import { PlayersList } from '@/shared/ui/Players/PlayersList/PlayersList';
import { selectCurrentCup } from '@/entities/CurrentCup/model/currentCupSlice';
import { Cup } from '@/screens/Cup';
import BestPlayers from '@/entities/BestPlayers/ui/BestPlayers';
import { PATHS } from '@/shared/lib/constants/constants';
import WinnerTeams from '@/entities/MainWinnerTeams/ui/MainWinnerTeams';
import InfoNews from '../Info/InfoNews';
import MainMatches from '../MainMatches/MainMatches';
import Video from '../Video/Video';
import classes from './main.module.scss';


const MainSections = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const { sponsorsData } = useAppSelector(selectSponsors);
  const { photoGalleryData } = useAppSelector(selectPhotoGallery);
  const { bestTourPlayers } = useAppSelector(selectDivisions);
  const { currentCup } = useAppSelector(selectCurrentCup);

  const isCupActive = useMemo(() => {
    if (!currentCup) return;
    const now = Date.now();
    const cupEndDate = new Date(currentCup.end_date);
    const cupEndDateInMilSeconds = cupEndDate.getTime();

    return now < cupEndDateInMilSeconds;
  }, [ currentCup ]);

  const showOpen = (id: number) => {
    router.push(`${PATHS.gallery}/${id}`);
  };

  const renderSponsorSlide = (slide: any) => <SponsorCard data={slide}/>;
  const renderGallery = (slide: any) => <NewsCard
    isAbleToShare
    isHovering={false}
    onOpen={showOpen}
    newsItem={slide}
    shareRoute={PATHS.gallery}
  />;

  return (
    <>
      {currentCup && isCupActive && <Cup />}
      <MainMatches/>
      <BannerRow/>
      <BestPlayers/>
      {!currentCup && !!bestTourPlayers.length && (
        <div className={classes.banner}>
          <div>
            <p className={classes.title}>{t('bestTourPlayers')}</p>
            <PlayersList isAbleToOpenCard players={bestTourPlayers}/>
          </div>
        </div>
      )}

      <InfoNews/>
      <Video/>
      <WinnerTeams/>
      {!!photoGalleryData.results.length && <Slider
        title={t('gallery')}
        pageHref={PATHS.gallery}
        slides={photoGalleryData.results}
        renderSlide={renderGallery}
        autoplay={photoGalleryData.results.length > 5}
        reverseAutoPlay
      />}
      {!!sponsorsData.results.length && <Slider
        pageHref={PATHS.sponsors}
        title={t('sponsors')}
        slides={sponsorsData.results}
        renderSlide={renderSponsorSlide}
        autoplay={sponsorsData.results.length > 5}
      />}
    </>
  );
};

export default MainSections;
