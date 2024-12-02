import { NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { Meta } from '@/shared/ui/seo/Meta';
import { Container } from '@/shared/ui/Container/Container';
import { useAppDispatch, useAppSelector } from '@/app/providers/StoreProvider';
import { getCurrentTable, getDivisions, getTourBest, selectDivisions } from '@/entities/Divisions/model/DivisionSlice';
import { getLeaguesNews, selectLeagueNews } from '@/entities/News/model/LeagueNewsSlice';
import { getWorldsNews, selectWorldNews } from '@/entities/WorldNews/model/WorldNewsSlice';
import { getMainVideos } from '@/entities/VideosPage/model/VideoPageSlice';
import { getSponsors, selectSponsors } from '@/entities/Sponsors/model/SponsorsSlice';
import { selectCurrentLeague } from '@/entities/CurrentLeague/model/CurrentLeague';
import { MainSections } from '@/entities/MainContent';
import { getCurrentCupDescription } from '@/entities/CurrentCup/model/currentCupSlice';
import Loader from '@/shared/ui/loader/Loader';
import { getPhotoGallery, selectPhotoGallery } from '@/entities/PhotoGallery/model/PhotoGallerySlice';
import classes from './home.module.scss';


const Home:NextPage = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { leagueId } = useAppSelector(selectCurrentLeague);
  const { leagueNews } = useAppSelector(selectLeagueNews);
  const { divisions, currentDivision } = useAppSelector(selectDivisions);
  const { sponsorsData } = useAppSelector(selectSponsors);
  const { worldNews } = useAppSelector(selectWorldNews);
  const { photoGalleryData } = useAppSelector(selectPhotoGallery);

  const [ isLoading, setIsLoading ] = useState(true);

  const handleGetMainPageData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        dispatch(getDivisions({ leagueId })),
        leagueNews.count ? null : dispatch(getLeaguesNews({ leagueId, limit: 8 })),
        worldNews.count ? null : dispatch(getWorldsNews({ limit: 8 })),
        sponsorsData.count ? null : dispatch(getSponsors({ leagueId, offset: 0 })),
        photoGalleryData.count ? null : dispatch(getPhotoGallery({ leagueId })),
        dispatch(getCurrentCupDescription({ leagueId })),
        dispatch(getMainVideos({ limit: 2, leagueId })),
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleGetMainPageData();
  }, []);

  useEffect(() => {
    const division = currentDivision.id ? currentDivision : divisions[ divisions.length - 1 ];
    if (divisions.length && division.id && division?.tour?.id) {
      dispatch(getCurrentTable({
        divisionId: division.id,
        tourId: division.tour.id,
      }));
      dispatch(getTourBest({ divisions }));
    }
  }, [ divisions.length, currentDivision.id ]);

  return (
    <div className={classes.wrapper}>
      <Meta title={t('mainPage')} description={t('mainPageSite') as string}>
      </Meta>
      <Container variant='large'>
        {!isLoading ?
          <MainSections/>
          :
          <div className={classes.loader}>
            <Loader/>
          </div>
        }

      </Container>
    </div>
  );
};

export default Home;
