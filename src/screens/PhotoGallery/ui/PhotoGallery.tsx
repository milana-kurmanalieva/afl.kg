import { NextPage } from 'next';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { PATHS, REQUEST_STATUSES } from '@/shared/lib/constants/constants';
import { Meta } from '@/shared/ui/seo/Meta';
import { Container } from '@/shared/ui/Container/Container';
import TopContent from '@/shared/ui/TopContent/TopContent';
import LoadMoreContainer from '@/shared/ui/LoadMoreContainer/LoadMoreContainer';
import { useAppDispatch } from '@/app/providers/StoreProvider';
import { selectCurrentLeague } from '@/entities/CurrentLeague/model/CurrentLeague';
import NewsList from '@/shared/ui/News/NewsList/NewsList';
import { getPhotoGallery, selectPhotoGallery } from '@/entities/PhotoGallery/model/PhotoGallerySlice';
import Loader from '@/shared/ui/loader/Loader';
import { BannerRow } from '@/entities/Banners';
import classes from './photoGallery.module.scss';


const limit = 16;

export const PhotoGalleryPage: NextPage = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { leagueId } = useSelector(selectCurrentLeague);
  const { photoGalleryData, photoGalleryStatus } = useSelector(selectPhotoGallery);
  const [ isLoading, setIsLoading ] = useState(false);
  const router = useRouter();

  const params = useMemo(() => ({
    limit,
    offset: photoGalleryData?.results.length,
    leagueId: leagueId,
  }), [ photoGalleryData, leagueId ]);

  const showMoreGallery = async () => {
    setIsLoading(true);

    const { results } = await dispatch(getPhotoGallery(params)).unwrap();

    if (!Array.isArray(results)) return;

    setIsLoading(false);

  };

  const pages = [
    {
      href: PATHS.gallery,
      page: t('photoGallery'),
    },
  ];

  const showOpen = (id: number) => {
    router.push(`${PATHS.gallery}/${id}`);
  };

  useEffect(() => {
    dispatch(getPhotoGallery(params));
  }, [ ]);

  if (photoGalleryStatus !== REQUEST_STATUSES.SUCCEEDED) return (
    <div className={classes.loader}>
      <Loader />
    </div>
  );

  return (
    <>
      <Meta title={t('photoGallery')} description=''>
      </Meta>
      <Container variant='large'>
        <TopContent title={t('photoGallery')} breadcrumbs={pages}>
        </TopContent>
        <BannerRow/>
        <LoadMoreContainer loadMore={showMoreGallery} hasMore={!!photoGalleryData.next} >
          <NewsList
            isLoading={isLoading}
            newsList={photoGalleryData.results}
            title={false}
            onOpen={showOpen}
            shareRoute={PATHS.gallery}
          />
        </LoadMoreContainer>
      </Container>
    </>
  );
};
