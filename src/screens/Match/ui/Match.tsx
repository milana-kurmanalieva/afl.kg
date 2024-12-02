import { NextPage } from 'next';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { Meta } from '@/shared/ui/seo/Meta';
import { Container } from '@/shared/ui/Container/Container';
import { useAppDispatch } from '@/app/providers/StoreProvider';
import {
  getCupMatches,
  getMatches,
  getMatchesAdditional,
  getPhotoAlbum,
  getVideoAlbum,
  selectMatches,
} from '@/entities/Matches/model/MatchesSlice';
import MatchesBlock from '@/shared/ui/Matches/MatchesBlock';
import { BestPlayerVariant, MATCH_TYPE, PATHS, REQUEST_STATUSES } from '@/shared/lib/constants/constants';
import { MatchDetail } from '@/shared/ui/Matches/MatchDetail';
import { MatchesType } from '@/shared/ui/Matches/MatchFinall';
import Loader from '@/shared/ui/loader/Loader';
import { ArchiveBanner } from '@/shared/ui/ArchiveBanner';
import { BannerRow } from '@/entities/Banners';
import { HTag } from '@/shared/ui/HTag/HTag';
import MatchTeams from '@/shared/ui/MatchTeams/MatchTeams';
import Slider from '@/shared/ui/Slider/Slider';
import NewsCard from '@/shared/ui/News/NewsCard/NewsCard';
import YouTubeVideo from '@/shared/ui/YouTubeVideo/VideoCard/YouTubeVideo';
import classes from './match.module.scss';


const MatchPage: NextPage = () => {
  const { t } = useTranslation();

  const {
    matchData,
    cupData,
    matchStatus,
    cupStatus,
    matchesAdditional,
    photoAlbums,
    videoAlbums,
  } = useSelector(selectMatches);

  const dispatch = useAppDispatch();
  const router = useRouter();

  const matchId = router.query.id;
  const matchType = router.query.type;

  useEffect(() => {
    if (!matchId) return;

    if (matchType === MATCH_TYPE.CUP_MATCH) {
      dispatch(getCupMatches(+matchId));
    } else {
      dispatch(getMatches(+matchId));
      dispatch(getMatchesAdditional(+matchId));
      dispatch(getPhotoAlbum(+matchId));
      dispatch(getVideoAlbum(+matchId));
    }
  }, [
    matchId,
    matchType,
    dispatch,
  ]);

  const selectedMatchData = matchType === MATCH_TYPE.CUP_MATCH ? cupData[ 0 ] : matchData[ 0 ];

  if (cupStatus !== REQUEST_STATUSES.SUCCEEDED && matchStatus !== REQUEST_STATUSES.SUCCEEDED) {
    return (
      <div className={classes.loader}>
        <Loader />
      </div>
    );
  }

  return (
    <>
      <Meta title={t('match')} description={t('match') as string} />
      <Container variant="large">
        <>
          {selectedMatchData && (
            <>
              <div className={classes.match}>
                {
                  selectedMatchData &&
                <MatchTeams
                  {...selectedMatchData}
                  tour={typeof selectedMatchData.tour === 'object' ? selectedMatchData?.tour?.number : ''}
                />
                }
              </div>
              <BannerRow />
              <MatchDetail match={selectedMatchData as MatchesType} />
              <ArchiveBanner
                variant={BestPlayerVariant.ONE_PLAYER}
                bestPlayer={selectedMatchData.best_player}
              />
            </>
          )}
          {matchType === MATCH_TYPE.MATCH && (
            <div className={classes.additionalInfo}>
              <HTag level={4}>{t('maybeInterested')}</HTag>
              <MatchesBlock
                title={t('matches')}
                matches={matchesAdditional}
                tourList={[]}
                showTour={matchType === MATCH_TYPE.MATCH}
              />
              {!!photoAlbums.length && (
                <Slider
                  title={t('photo')}
                  slides={photoAlbums && photoAlbums}
                  renderSlide={(slide) => <NewsCard
                    isHovering={false}
                    newsItem={slide}
                    shareRoute={PATHS.gallery}
                  />
                  }
                  titleClass={classes.title}
                  pageHref={PATHS.gallery}
                />
              )
              }
              {!!videoAlbums.length && (
                <Slider
                  title={t('video')}
                  slides={videoAlbums && videoAlbums}
                  pageHref={PATHS.gallery}
                  renderSlide={(slide) => <YouTubeVideo
                    link={slide.url}
                    key={slide.id}
                    title={slide.title}
                    isBlackOut={true}
                  />
                  }
                  titleClass={classes.title}
                />
              )}
            </div>
          )}
        </>
      </Container>
    </>
  );
};

export default MatchPage;
