import { NextPage } from 'next';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import format from 'date-fns/format';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useAppDispatch } from '@/app/providers/StoreProvider';
import { selectCurrentLeague } from '@/entities/CurrentLeague/model/CurrentLeague';
import { DATE_FORMAT, PATHS, REQUEST_STATUSES, SHARE_BASE_URL } from '@/shared/lib/constants/constants';
import { Meta } from '@/shared/ui/seo/Meta';
import { Container } from '@/shared/ui/Container/Container';
import TopContent from '@/shared/ui/TopContent/TopContent';
import { getPhotoEssay, selectPhotoEssay } from '@/entities/PhotoEssay/model/PhotoEssaySlice';
import { PhotoEssayModal } from '@/shared/ui/PhotoEssayModal/PhotoEssayModal';
import { EmptyState } from '@/shared/ui/EmptyState/EmptyState';
import Loader from '@/shared/ui/loader/Loader';
import { BannerRow } from '@/entities/Banners';
import classes from './photoEssay.module.scss';


export const PhotoEssayPage:NextPage = ({ galleryData }:any) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { leagueId } = useSelector(selectCurrentLeague);
  const { photoEssayData, photoEssayStatus } = useSelector(selectPhotoEssay);
  const [ isGalleryOpen, setIsGalleryOpen ] = useState(false);
  const [ startIndex, setStartIndex ] = useState(0);

  const pages = [
    {
      href: PATHS.photoEssay,
      page: t('photoReport'),
    },
  ];

  const onOpen = (index: number) => {
    setIsGalleryOpen(true);
    setStartIndex(index);
  };

  useEffect(() => {
    if (router.query.id) dispatch(getPhotoEssay({ leagueId, albumId: +router.query.id }));
  }, [ dispatch ]);

  return (
    <>
      {galleryData && (
        <Meta title={galleryData.title}>
          <meta name="title" content={galleryData.title} />
          <meta name="description" content={galleryData.description} />

          <meta property="og:site_name" content="FootballKg" />
          <link rel="canonical" href={`${SHARE_BASE_URL}${PATHS.gallery}/${galleryData.id}`} />

          <meta property="og:type" content="article" />
          <meta property="og:url" content={`${SHARE_BASE_URL}${PATHS.gallery}/${galleryData.id}`} />
          <meta property="og:title" content={galleryData.title} />
          <meta property="og:description" content={galleryData.description} />
          <meta property="og:image" content={galleryData?.images?.[ 0 ]?.image} />
          <meta property="og:image:width" content="200" />
          <meta property="og:image:height" content="100" />

          <meta property="twitter:card" content="summary_large_image" />
          <meta property="twitter:url" content={`${SHARE_BASE_URL}${PATHS.gallery}/${galleryData.id}`} />
          <meta property="twitter:title" content={galleryData.title} />
          <meta property="twitter:description" content={galleryData.description} />
          <meta property="twitter:image" content="https://metatags.io/images/meta-tags.png" />
          <meta property="twitter:image" content={galleryData?.images?.[ 0 ]?.image} />
          <meta property="twitter:image:width" content="200" />
          <meta property="twitter:image:height" content="100" />
        </Meta>
      )}
      {photoEssayStatus !== REQUEST_STATUSES.SUCCEEDED ? (
        <div className={classes.loader}>
          <Loader />
        </div>
      ) : (
        <Container variant="large">
          <TopContent
            title={t('photoReport')}
            breadcrumbs={pages}
          >
          </TopContent>
          <div className={classes.info}>
            <h3 className={classes.title}>{photoEssayData.title}</h3>
            <p className={classes.description}>{photoEssayData.description}</p>
            <p className={classes.date}>{format(new Date(photoEssayData.date), DATE_FORMAT)}</p>
          </div>
          <BannerRow/>
          {!photoEssayData.images.length && (
            <EmptyState/>
          )}
          <div className={classes.wrapper}>
            {
              photoEssayData.images.map(({ image }, index) => {
                return <img
                  alt='photo'
                  onClick={() => onOpen(index)}
                  src={image}
                  key={image}
                />;
              })}
          </div>
          {isGalleryOpen ?
            <PhotoEssayModal
              startIndex={startIndex}
              isGalleryOpen={isGalleryOpen}
              setIsGalleryOpen={setIsGalleryOpen}
            />
            : ''}
        </Container>
      )}
    </>
  );

};
