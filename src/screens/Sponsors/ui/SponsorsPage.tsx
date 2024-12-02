import { NextPage } from 'next';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch } from '@/app/providers/StoreProvider';
import { Meta } from '@/shared/ui/seo/Meta';
import { Container } from '@/shared/ui/Container/Container';
import TopContent from '@/shared/ui/TopContent/TopContent';
import { PATHS, REQUEST_STATUSES } from '@/shared/lib/constants/constants';
import SponsorCard from '@/shared/ui/SponsorCard/SponsorCard';
import { selectCurrentLeague } from '@/entities/CurrentLeague/model/CurrentLeague';
import { getSponsors, selectSponsors } from '@/entities/Sponsors/model/SponsorsSlice';
import LoadMoreContainer from '@/shared/ui/LoadMoreContainer/LoadMoreContainer';
import { SponsorsSkeletonCard } from '@/shared/ui/Skeleton/SponsorsSkeleton/SponsorsSkeletonCard';
import Loader from '@/shared/ui/loader/Loader';
import { BannerRow } from '@/entities/Banners';
import classes from './sponsors.module.scss';


const limit = 16;


export const SponsorsPage: NextPage = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { leagueId } = useSelector(selectCurrentLeague);
  const { sponsorsData, sponsorsStatus } = useSelector(selectSponsors);
  const [ isLoading, setIsLoading ] = useState(false);

  const params = useMemo(() => ({
    limit,
    offset: sponsorsData?.results.length,
    leagueId: leagueId,
  }), [ sponsorsData.results.length, leagueId ]);

  const showMoreSponsors = async () => {
    if (params.offset < sponsorsData.results.length) return;
    setIsLoading(true);

    const { results } = await dispatch(getSponsors(params)).unwrap();

    if (!Array.isArray(results)) return;

    setIsLoading(false);

  };

  const pages = [
    {
      href: PATHS.sponsors,
      page: t('sponsors'),
    },
  ];


  useEffect(() => {
    dispatch(getSponsors(params));
  }, [ dispatch ]);

  if (sponsorsStatus !== REQUEST_STATUSES.SUCCEEDED) return (
    <div className={classes.loader}>
      <Loader />
    </div>
  );

  return (
    <>
      <Meta title={t('sponsors')} description=''>
      </Meta>
      <Container variant='large'>
        <TopContent
          title={t('sponsors')}
          breadcrumbs={pages}
        >
        </TopContent>
        <BannerRow/>
        <LoadMoreContainer loadMore={showMoreSponsors} hasMore={!!sponsorsData.next} >
          <div className={classes.AllSponsors}>
            {sponsorsData.results?.map(item => (
              <SponsorCard key={item.name} data={item}/>
            ))}
            {isLoading && [ ... Array(limit) ].map((_, index) => (
              <SponsorsSkeletonCard key={index} />
            ))}
          </div>
        </LoadMoreContainer>
      </Container>
    </>
  );
};
